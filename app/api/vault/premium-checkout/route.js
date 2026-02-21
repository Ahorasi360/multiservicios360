import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const VAULT_PLANS = {
  monthly: {
    amount: 499,
    name: 'Vault Premium - Monthly',
    nameEs: 'Bóveda Premium - Mensual',
    mode: 'subscription',
    interval: 'month',
  },
  annual: {
    amount: 4900,
    name: 'Vault Premium - Annual',
    nameEs: 'Bóveda Premium - Anual',
    mode: 'subscription',
    interval: 'year',
  },
};

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

  try {
    const body = await request.json();
    const { plan, vault_token_id, client_email, language } = body;

    const planConfig = VAULT_PLANS[plan];
    if (!planConfig) {
      return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
    }

    const isSpanish = language === 'es';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://multiservicios360.net';

    const sessionConfig = {
      payment_method_types: ['card'],
      customer_email: client_email,
      metadata: {
        vault_token_id: vault_token_id,
        premium_type: plan,
        source: 'vault_premium',
      },
      success_url: `${baseUrl}/vault/premium-success?session_id={CHECKOUT_SESSION_ID}&token=${vault_token_id}`,
      cancel_url: `${baseUrl}/vault/${vault_token_id}?canceled=true`,
    };

    if (planConfig.mode === 'subscription') {
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: isSpanish ? planConfig.nameEs : planConfig.name,
            description: isSpanish
              ? 'Acceso permanente a su Bóveda Digital - Multi Servicios 360'
              : 'Permanent access to your Digital Vault - Multi Servicios 360',
          },
          unit_amount: planConfig.amount,
          recurring: { interval: planConfig.interval },
        },
        quantity: 1,
      }];
    } else {
      sessionConfig.mode = 'payment';
      sessionConfig.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: isSpanish ? planConfig.nameEs : planConfig.name,
            description: isSpanish
              ? 'Acceso de por vida a su Bóveda Digital - Multi Servicios 360'
              : 'Lifetime access to your Digital Vault - Multi Servicios 360',
          },
          unit_amount: planConfig.amount,
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Vault premium checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
