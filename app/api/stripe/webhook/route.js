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
  }

  return NextResponse.json({ received: true });
}
