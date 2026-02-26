export const dynamic = 'force-dynamic';
﻿import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }); }

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Map document types to their Supabase table names
const TABLE_MAP = {
  general_poa: 'poa_matters',
  limited_poa: 'limited_poa_matters',
  living_trust: 'trust_matters',
  llc_formation: 'llc_matters',
  // Simple documents (all share one table)
  bill_of_sale: 'simple_doc_matters',
  affidavit: 'simple_doc_matters',
  revocation_poa: 'simple_doc_matters',
  authorization_letter: 'simple_doc_matters',
  promissory_note: 'simple_doc_matters',
  guardianship_designation: 'simple_doc_matters',
  travel_authorization: 'simple_doc_matters',
};

// Map document types to vault document types
const VAULT_DOC_MAP = {
  general_poa: 'poa_general',
  limited_poa: 'poa_limited',
  living_trust: 'living_trust',
  llc_formation: 'operating_agreement',
  bill_of_sale: 'bill_of_sale',
  affidavit: 'affidavit',
  revocation_poa: 'revocation_poa',
  authorization_letter: 'authorization_letter',
  promissory_note: 'promissory_note',
  guardianship_designation: 'guardianship_designation',
};

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
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
      // NOTIFY OWNER (email + SMS) ON EVERY SALE
      // -----------------------------------------------
      try {
        const clientName = session.customer_details?.name || session.metadata?.clientName || 'Unknown';
        const clientEmail = session.customer_details?.email || session.metadata?.clientEmail || '';

        // Look up partner name if applicable
        let partnerName = null;
        const { data: matterForPartner } = await supabase
          .from(tableName).select('partner_id').eq('id', matterId).single();
        if (matterForPartner?.partner_id) {
          const { data: partnerData } = await supabase
            .from('partners').select('business_name').eq('id', matterForPartner.partner_id).single();
          if (partnerData) partnerName = partnerData.business_name;
        }

        const { notifyOwnerOfSale } = await import('../../../../lib/notify-owner');
        await notifyOwnerOfSale({
          documentType,
          clientName,
          clientEmail,
          amount: session.amount_total,
          matterId,
          partnerName,
          reviewTier: session.metadata?.reviewTier || null,
          selectedAddons: session.metadata?.selectedAddons ? session.metadata.selectedAddons.split(',') : [],
        });
      } catch (notifyErr) {
        console.error('Owner notification error (non-critical):', notifyErr.message);
      }
      // -----------------------------------------------
      try {
        // Get the matter to find partner_id and client info
        const { data: matter } = await supabase
          .from(tableName)
          .select('partner_id, client_name, client_email')
          .eq('id', matterId)
          .single();

        if (matter?.partner_id) {
          // Look up partner to get commission rate
          const { data: partner } = await supabase
            .from('partners')
            .select('id, commission_rate')
            .eq('id', matter.partner_id)
            .single();

          if (partner) {
            const commRate = parseFloat(partner.commission_rate) || 20;
            const commissionAmount = (totalPrice || 0) * (commRate / 100);

            // Find client_id if exists in partner_clients
            let clientId = null;
            if (matter.client_email) {
              const { data: client } = await supabase
                .from('partner_clients')
                .select('id')
                .eq('partner_id', matter.partner_id)
                .eq('client_email', matter.client_email)
                .single();
              if (client) clientId = client.id;
            }

            // Check if referral already exists for this matter
            const { data: existingRef } = await supabase
              .from('partner_referrals')
              .select('id')
              .eq('partner_id', matter.partner_id)
              .eq('document_id', matterId)
              .single();

            if (!existingRef) {
              const { error: refError } = await supabase
                .from('partner_referrals')
                .insert({
                  partner_id: matter.partner_id,
                  client_id: clientId,
                  document_type: documentType,
                  document_id: matterId,
                  sale_amount: totalPrice || 0,
                  commission_amount: commissionAmount,
                  payment_method: 'stripe',
                  status: 'pending',
                });

              if (refError) {
                console.error('Partner referral creation error:', refError);
              } else {
                console.log(`Partner commission: $${commissionAmount.toFixed(2)} (${commRate}% of $${totalPrice}) for partner ${matter.partner_id}`);
              }
            }
          }
        }
      } catch (partnerCommErr) {
        console.error('Partner commission tracking error (non-critical):', partnerCommErr);
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
    const partnerMetaType = session.metadata?.type; // used by sales registration flow
    const partnerId = session.metadata?.partner_id;

    // Normalize: sales registration uses metadata.type = 'partner_setup_fee'
    // Portal membership uses metadata.payment_type = 'setup_fee' or 'annual_renewal'
    const normalizedPaymentType = partnerPaymentType ||
      (partnerMetaType === 'partner_setup_fee' ? 'setup_fee' : null);

    if (partnerId && normalizedPaymentType && (normalizedPaymentType === 'setup_fee' || normalizedPaymentType === 'annual_renewal')) {
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
        if (normalizedPaymentType === 'setup_fee') {
          partnerUpdate.setup_fee_paid = true;
          partnerUpdate.setup_fee_paid_at = new Date().toISOString();
          partnerUpdate.setup_fee_payment_id = session.payment_intent;
          partnerUpdate.status = 'paid_pending_approval'; // move to approval queue
          // Set membership expiry to 1 year from now
          partnerUpdate.membership_expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        } else if (normalizedPaymentType === 'annual_renewal') {
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
        if (normalizedPaymentType === 'setup_fee') {
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

        console.log(`Partner payment processed: ${normalizedPaymentType} — $${paymentAmount} for partner ${partnerId}`);
      } catch (partnerPayErr) {
        console.error('Partner payment processing error (non-critical):', partnerPayErr);
      }
    }

    // -----------------------------------------------
    // HAZTE-SOCIO PARTNER REGISTRATION PAYMENT
    // -----------------------------------------------
    const paymentSource = session.metadata?.source;
    if (paymentSource === 'hazte-socio') {
      try {
        const ref         = session.metadata?.ref || 'direct';
        const packageKey  = session.metadata?.package_key || 'pro';
        const businessName = session.metadata?.business_name || '';
        const contactName  = session.metadata?.contact_name || '';
        const email        = session.metadata?.email || session.customer_details?.email || '';
        const phone        = session.metadata?.phone || '';
        const partnerType  = session.metadata?.partner_type || 'tax_preparer';
        const amountPaid   = session.amount_total ? session.amount_total / 100 : 0;

        const PACKAGES = {
          start: { name: 'Partner Start', commission_rate: 20, tier: 'start' },
          pro:   { name: 'Partner Pro',   commission_rate: 25, tier: 'pro' },
          elite: { name: 'Partner Elite', commission_rate: 30, tier: 'elite' },
        };
        const pkg = PACKAGES[packageKey] || PACKAGES.pro;

        // 1. Mark lead as paid
        await supabase.from('partner_leads').update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        }).eq('ref', ref);

        // 2. Create partner record (pending approval)
        // Generate temp password for new partner
        const { default: cryptoMod } = await import('crypto');
        const tempPassword = cryptoMod.randomBytes(4).toString('hex').toUpperCase() + '!' + cryptoMod.randomBytes(2).toString('hex');
        const passwordHash = cryptoMod.createHash('sha256').update(tempPassword).digest('hex');

        // Generate referral code
        const refCode = businessName.substring(0, 3).toUpperCase() + cryptoMod.randomBytes(3).toString('hex').toUpperCase();

        const { data: newPartner, error: partnerErr } = await supabase.from('partners').insert({
          business_name: businessName,
          contact_name: contactName,
          email,
          phone,
          partner_type: partnerType,
          tier: pkg.tier,
          commission_rate: pkg.commission_rate,
          package_name: packageKey,
          setup_fee_amount: amountPaid,
          annual_fee_amount: amountPaid,
          status: 'paid_pending_approval',
          setup_fee_paid: true,
          setup_fee_paid_at: new Date().toISOString(),
          setup_fee_payment_id: session.payment_intent,
          membership_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          password_hash: passwordHash,
          temp_password: tempPassword,
          referral_code: refCode,
        }).select().single();

        if (partnerErr) {
          console.error('Partner creation error:', partnerErr);
        } else {
          console.log('Partner created:', newPartner.id, '—', businessName);
        }

        // 3. Notify Anthony — email + SMS
        const { notifyOwnerOfSale } = await import('../../../../lib/notify-owner');
        await notifyOwnerOfSale({
          documentType: 'partner_registration',
          clientName: contactName,
          clientEmail: email,
          amount: session.amount_total,
          matterId: newPartner?.id || ref,
          partnerName: businessName,
          reviewTier: pkg.name,
          selectedAddons: [],
        });

        // 4. Send welcome email to new partner
        const { Resend } = await import('resend');
        const resend = new (Resend)(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Anthony Galeano — Multi Servicios 360 <no-reply@out.multiservicios360.net>',
          to: [email],
          subject: '¡Bienvenido a la Red de Socios — Multi Servicios 360!',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
              <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
                <h1 style="color:white;margin:0;font-size:24px;font-weight:900;">¡Bienvenido, ${contactName}!</h1>
                <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Ya es socio oficial de Multi Servicios 360</p>
              </div>
              <div style="background:white;padding:32px;border:1px solid #E5E7EB;border-radius:0 0 12px 12px;">
                <p style="font-size:15px;color:#374151;line-height:1.7;">Su pago de <strong>$${amountPaid}</strong> fue procesado exitosamente.</p>
                <div style="background:#F0F4FF;border-left:4px solid #1E3A8A;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
                  <p style="margin:0 0 6px;font-size:14px;color:#1E3A8A;font-weight:700;">Plan: ${pkg.name}</p>
                  <p style="margin:0;font-size:14px;color:#374151;">Comisión: <strong>${pkg.commission_rate}%</strong> por cada venta</p>
                </div>
                <p style="font-size:15px;color:#374151;line-height:1.7;">En las próximas <strong>24 horas</strong> le enviaremos las credenciales de acceso a su portal de socio.</p>
                <div style="text-align:center;margin:24px 0;">
                  <p style="font-size:14px;color:#6B7280;margin:0 0 8px;">¿Preguntas? Estamos aquí:</p>
                  <a href="tel:8552467274" style="font-size:22px;font-weight:900;color:#1E3A8A;text-decoration:none;">📞 855.246.7274</a>
                  <p style="font-size:13px;color:#6B7280;margin:4px 0 0;">Lunes–Sábado 9am–6pm | En español</p>
                </div>
                <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0;">
                <p style="margin:0;font-size:13px;color:#6B7280;">Anthony Galeano — Fundador, Multi Servicios 360</p>
              </div>
            </div>
          `,
        });

        console.log('Hazte-socio payment fully processed for:', businessName, '—', pkg.name);
      } catch (hazteErr) {
        console.error('Hazte-socio payment processing error:', hazteErr);
      }
    }

    // -----------------------------------------------
    // VAULT PREMIUM UPGRADE
    // -----------------------------------------------
    const vaultSource = session.metadata?.source;
    if (vaultSource === 'vault_premium') {
      try {
        const vaultTokenId = session.metadata?.vault_token_id;
        const premiumType = session.metadata?.premium_type;
        
        if (vaultTokenId) {
          const updateData = {
            is_premium: true,
            premium_type: premiumType,
          };

          if (premiumType === 'annual') {
            const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
            updateData.premium_expires_at = expiresAt;
            updateData.expires_at = expiresAt;
            updateData.premium_stripe_subscription_id = session.subscription || null;
          } else if (premiumType === 'monthly') {
            const expiresAt = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();
            updateData.premium_expires_at = expiresAt;
            updateData.expires_at = expiresAt;
            updateData.premium_stripe_subscription_id = session.subscription || null;
          }

          await supabase
            .from('vault_tokens')
            .update(updateData)
            .eq('id', vaultTokenId);

          console.log(`Vault Premium activated: ${premiumType} for token ${vaultTokenId}`);
        }
      } catch (vaultPremErr) {
        console.error('Vault premium processing error:', vaultPremErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
