export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }); }

// Pricing configuration matching llc-config.js
const TIER_PRICES = {
  llc_standard: {
    name: 'California LLC - Standard',
    price: 79900,
  },
  llc_plus: {
    name: 'California LLC - Plus',
    price: 119900,
  },
  llc_elite: {
    name: 'California LLC - Elite',
    price: 169900,
  }
};

const ENTITY_VAULT = {
  name: 'Entity Vault™ (Annual)',
  price: 9900,
};

const UPSELL_PRICES = {
  rush_prep: { name: 'Rush Preparation (24-48 hrs)', price: 14900 },
  oa_amendment: { name: 'Operating Agreement Amendment Credit', price: 19900 },
  soi_amendment: { name: 'SOI Amendment Prep', price: 7500 },
  registered_agent: { name: 'Registered Agent Service (Annual)', price: 19900 },
  certified_copy: { name: 'Certified Copy Prep', price: 9900 },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      tier,
      upsells = [],
      filingSpeed,
      intakeData,
      clientName,
      clientEmail,
      clientPhone,
      matterId,
      language
    } = body;

    // Validate tier
    if (!TIER_PRICES[tier]) {
      return NextResponse.json({ error: 'Invalid tier selected' }, { status: 400 });
    }

    // Build line items
    const lineItems = [];

    // Add tier
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: TIER_PRICES[tier].name,
          description: language === 'es'
            ? 'Formación de LLC en California - Incluye Artículos de Organización y Acuerdo Operativo'
            : 'California LLC Formation - Includes Articles of Organization and Operating Agreement',
        },
        unit_amount: TIER_PRICES[tier].price,
      },
      quantity: 1,
    });

    // Add Entity Vault (mandatory)
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: ENTITY_VAULT.name,
          description: language === 'es'
            ? 'Almacenamiento seguro, recordatorios SOI, seguimiento de cumplimiento'
            : 'Secure storage, SOI reminders, compliance tracking',
        },
        unit_amount: ENTITY_VAULT.price,
      },
      quantity: 1,
    });

    // Add selected upsells
    for (const upsellId of upsells) {
      if (UPSELL_PRICES[upsellId]) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: UPSELL_PRICES[upsellId].name,
            },
            unit_amount: UPSELL_PRICES[upsellId].price,
          },
          quantity: 1,
        });
      }
    }

    // Create Stripe checkout session
    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://multiservicios360.vercel.app';
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/llc/success?session_id={CHECKOUT_SESSION_ID}&matter_id=${matterId}`,
      cancel_url: `${baseUrl}/llc?canceled=true`,
      customer_email: clientEmail,
      metadata: {
        product: 'california_llc',
        product_type: 'llc_formation',
        matter_id: matterId,
        tier: tier,
        upsells: JSON.stringify(upsells),
        filing_speed: filingSpeed,
        client_name: clientName,
        client_phone: clientPhone,
        llc_name: intakeData?.llc_name || '',
        language: language,
      },
      payment_intent_data: {
        metadata: {
          product: 'california_llc',
          product_type: 'llc_formation',
          matter_id: matterId,
          tier: tier,
          client_name: clientName,
          llc_name: intakeData?.llc_name || '',
        }
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}