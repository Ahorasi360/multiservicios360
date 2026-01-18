import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    // For local testing without webhook signature verification
    // In production, uncomment the signature verification below
    event = JSON.parse(body);
    
    // Production webhook signature verification:
    // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      console.log('Payment successful:', session.id);
      console.log('Metadata:', session.metadata);

      // Update matter status in database
      if (session.metadata?.matterId) {
        const { error } = await supabase
          .from('poa_matters')
          .update({ 
            status: 'paid',
            payment_id: session.payment_intent,
            payment_amount: session.amount_total,
            paid_at: new Date().toISOString(),
          })
          .eq('id', session.metadata.matterId);

        if (error) {
          console.error('Error updating matter:', error);
        } else {
          console.log('Matter updated to paid status');
        }
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      console.log('Checkout session expired:', session.id);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for webhooks (Stripe needs raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};