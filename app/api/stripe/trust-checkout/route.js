import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Email validation function
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5) return false; // minimum: a@b.c
  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

// Tier pricing
const TIER_PRICES = {
  trust_core: { amount: 59900, name: 'California Living Trust - Core' },
  trust_plus: { amount: 89900, name: 'California Living Trust - Plus' },
  trust_elite: { amount: 129900, name: 'California Living Trust - Elite' }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { matterId, tier, clientName, clientEmail, intakeData } = body;

    // Validate required fields
    if (!matterId) {
      return NextResponse.json({ error: 'Matter ID is required' }, { status: 400 });
    }

    if (!tier || !TIER_PRICES[tier]) {
      return NextResponse.json({ error: 'Invalid tier selected' }, { status: 400 });
    }

    // VALIDATE EMAIL BEFORE STRIPE - Critical validation
    if (!clientEmail || !isValidEmail(clientEmail)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address (e.g., name@example.com)',
        error_es: 'Por favor ingrese un correo electrónico válido (ej: nombre@ejemplo.com)',
        code: 'INVALID_EMAIL'
      }, { status: 400 });
    }

    const cleanEmail = clientEmail.trim().toLowerCase();
    const tierConfig = TIER_PRICES[tier];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://multiservicios360.vercel.app';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tierConfig.name,
              description: `Self-prepared California Living Trust - ${tier.replace('trust_', '').charAt(0).toUpperCase() + tier.replace('trust_', '').slice(1)} Package`,
            },
            unit_amount: tierConfig.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/trust/success?session_id={CHECKOUT_SESSION_ID}&matter_id=${matterId}`,
      cancel_url: `${baseUrl}/trust?canceled=true`,
      customer_email: cleanEmail,
      metadata: {
        matter_id: matterId,
        tier: tier,
        client_name: clientName || '',
        document_type: 'california_living_trust'
      },
    });

    // Update matter with Stripe session ID
    if (matterId) {
      await supabase
        .from('trust_matters')
        .update({ 
          stripe_session_id: session.id,
          review_tier: tier,
          client_email: cleanEmail,
          client_name: clientName || ''
        })
        .eq('id', matterId);
    }

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe error:', error);
    
    // Handle specific Stripe errors
    if (error.code === 'email_invalid') {
      return NextResponse.json({ 
        error: 'Invalid email address format',
        error_es: 'Formato de correo electrónico inválido',
        code: 'INVALID_EMAIL'
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session: ' + error.message },
      { status: 500 }
    );
  }
}