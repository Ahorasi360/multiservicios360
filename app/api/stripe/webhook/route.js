import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
      const tableName = documentType === 'limited_poa' ? 'limited_poa_matters' : 'poa_matters';
      
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
    } else {
      console.log('No matterId in metadata');
    }
  }

  return NextResponse.json({ received: true });
}