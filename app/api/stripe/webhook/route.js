import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Map document types to their Supabase table names
const TABLE_MAP = {
  general_poa: 'poa_matters',
  limited_poa: 'limited_poa_matters',
  living_trust: 'trust_matters',
  llc_formation: 'llc_matters',
};

// Map document types to vault document types
const VAULT_DOC_MAP = {
  general_poa: 'poa_general',
  limited_poa: 'poa_limited',
  living_trust: 'living_trust',
  llc_formation: 'operating_agreement',
};

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  console.log('Webhook received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Payment successful:', session.id);
    console.log('Metadata:', session.metadata);

    const matterId = session.metadata?.matterId;
    const documentType = session.metadata?.documentType;
    const totalPrice = session.amount_total ? session.amount_total / 100 : null;

    if (matterId) {
      // Determine the correct table
      const tableName = TABLE_MAP[documentType] || 'poa_matters';

      const { error } = await supabase
        .from(tableName)
        .update({
          status: 'paid',
          payment_id: session.payment_intent,
          total_price: totalPrice,
          paid_at: new Date().toISOString(),
        })
        .eq('id', matterId);

      if (error) {
        console.error('Error updating ' + tableName + ':', error);
      } else {
        console.log(tableName + ' updated to paid status');
      }

      // -----------------------------------------------
      // TRACK SALES REP COMMISSION (automatic)
      // If this matter came from a partner, and that
      // partner was onboarded by a sales rep, give
      // the rep their commission automatically.
      // -----------------------------------------------
      try {
        // Get the matter to find partner_id
        const { data: matter } = await supabase
          .from(tableName)
          .select('partner_id')
          .eq('id', matterId)
          .single();

        if (matter?.partner_id) {
          // Check if a sales rep has an active commission on this partner
          const { data: activeCommissions } = await supabase
            .from('sales_commissions')
            .select('id, sales_rep_id, commission_rate, total_document_sales, total_commission_earned')
            .eq('partner_id', matter.partner_id)
            .eq('status', 'active')
            .gte('end_date', new Date().toISOString());

          if (activeCommissions && activeCommissions.length > 0) {
            for (const commission of activeCommissions) {
              const commissionAmount = (totalPrice || 0) * (commission.commission_rate / 100);

              // Create commission entry
              await supabase.from('sales_commission_entries').insert({
                sales_commission_id: commission.id,
                sales_rep_id: commission.sales_rep_id,
                partner_id: matter.partner_id,
                matter_type: documentType,
                matter_id: matterId,
                document_price: totalPrice || 0,
                commission_amount: commissionAmount,
                status: 'pending',
              });

              // Update running totals
              await supabase
                .from('sales_commissions')
                .update({
                  total_document_sales: Number(commission.total_document_sales || 0) + (totalPrice || 0),
                  total_commission_earned: Number(commission.total_commission_earned || 0) + commissionAmount,
                })
                .eq('id', commission.id);

              console.log(`Sales commission: $${commissionAmount.toFixed(2)} for rep ${commission.sales_rep_id} (${commission.commission_rate}% of $${totalPrice})`);
            }
          }
        }
      } catch (commissionError) {
        // Commission tracking is non-critical
        console.error('Sales commission tracking error (non-critical):', commissionError);
      }

      // ----------------------------------------------
      // CREATE VAULT TOKEN FOR CLIENT DOCUMENT ACCESS
      // ----------------------------------------------
      try {
        const clientName = session.customer_details?.name || session.metadata?.clientName || '';
        const clientEmail = session.customer_details?.email || session.metadata?.clientEmail || '';
        const vaultDocType = VAULT_DOC_MAP[documentType] || documentType;

        // Generate secure 64-char token
        const token = crypto.randomBytes(32).toString('hex');

        // Check if vault already exists for this matter
        const { data: existingToken } = await supabase
          .from('vault_tokens')
          .select('id, token')
          .eq('matter_id', matterId)
          .single();

        let vaultToken;

        if (existingToken) {
          vaultToken = existingToken;
        } else {
          const { data: newToken, error: tokenError } = await supabase
            .from('vault_tokens')
            .insert({
              matter_id: matterId,
              service_type: documentType,
              token,
              client_email: clientEmail,
              client_name: clientName,
              expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .select()
            .single();

          if (tokenError) {
            console.error('Vault token creation failed:', tokenError);
          } else {
            vaultToken = newToken;
            console.log('Vault token created:', newToken.token.substring(0, 12) + '...');
          }
        }

        // Note: Vault documents will be added by the document generators
        // (success pages) when they upload PDFs to Supabase storage.
        // The token is ready and waiting for documents to be linked.

        if (vaultToken) {
          const vaultUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net'}/vault?code=${vaultToken.token}`;
          console.log('Vault URL:', vaultUrl);

          // Send vault access email to client
          if (clientEmail) {
            const { sendVaultEmail } = await import('../../../../lib/send-vault-email');
            await sendVaultEmail(clientEmail, clientName, vaultUrl, documentType);
          }
        }
      } catch (vaultError) {
        // Vault creation is non-critical — don't fail the webhook
        console.error('Vault creation error (non-critical):', vaultError);
      }
    } else {
      console.log('No matterId in metadata');
    }

    // -----------------------------------------------
    // PARTNER SETUP FEE / ANNUAL RENEWAL PAYMENT
    // -----------------------------------------------
    const partnerPaymentId = session.metadata?.payment_id;
    const partnerPaymentType = session.metadata?.payment_type;
    const partnerId = session.metadata?.partner_id;

    if (partnerId && partnerPaymentType && (partnerPaymentType === 'setup_fee' || partnerPaymentType === 'annual_renewal')) {
      try {
        const paymentAmount = session.amount_total ? session.amount_total / 100 : 0;

        // Update payment record
        if (partnerPaymentId) {
          await supabase
            .from('partner_payments')
            .update({
              status: 'paid',
              stripe_payment_id: session.payment_intent,
              paid_at: new Date().toISOString(),
              amount: paymentAmount,
            })
            .eq('id', partnerPaymentId);
        }

        // Update partner record
        const partnerUpdate = {};
        if (partnerPaymentType === 'setup_fee') {
          partnerUpdate.setup_fee_paid = true;
          partnerUpdate.setup_fee_paid_at = new Date().toISOString();
          partnerUpdate.setup_fee_payment_id = session.payment_intent;
          // Set membership expiry to 1 year from now
          partnerUpdate.membership_expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        } else if (partnerPaymentType === 'annual_renewal') {
          // Extend membership by 1 year from current expiry or from now
          const { data: currentPartner } = await supabase
            .from('partners')
            .select('membership_expires_at')
            .eq('id', partnerId)
            .single();

          const currentExpiry = currentPartner?.membership_expires_at ? new Date(currentPartner.membership_expires_at) : new Date();
          const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
          partnerUpdate.membership_expires_at = new Date(baseDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
        }

        await supabase.from('partners').update(partnerUpdate).eq('id', partnerId);

        // Auto-track sales rep setup fee share
        if (partnerPaymentType === 'setup_fee') {
          const { data: activeCommissions } = await supabase
            .from('sales_commissions')
            .select('id, sales_rep_id, setup_fee_share_percent, setup_fee_amount')
            .eq('partner_id', partnerId)
            .eq('status', 'active');

          if (activeCommissions) {
            for (const comm of activeCommissions) {
              if (comm.setup_fee_amount > 0) {
                await supabase.from('sales_commissions')
                  .update({ setup_fee_paid: true })
                  .eq('id', comm.id);

                // Record as commission entry
                await supabase.from('sales_commission_entries').insert({
                  sales_commission_id: comm.id,
                  sales_rep_id: comm.sales_rep_id,
                  partner_id: partnerId,
                  matter_type: 'setup_fee',
                  matter_id: partnerId,
                  document_price: paymentAmount,
                  commission_amount: comm.setup_fee_amount,
                  status: 'pending',
                });

                console.log(`Setup fee share: $${comm.setup_fee_amount} for rep ${comm.sales_rep_id}`);
              }
            }
          }
        }

        console.log(`Partner payment processed: ${partnerPaymentType} — $${paymentAmount} for partner ${partnerId}`);
      } catch (partnerPayErr) {
        console.error('Partner payment processing error (non-critical):', partnerPayErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
