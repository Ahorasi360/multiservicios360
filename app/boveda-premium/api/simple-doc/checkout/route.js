import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const PRICING = {
  bill_of_sale: { amount: 6900, name: 'Bill of Sale', nameEs: 'Carta de Venta' },
  affidavit: { amount: 8900, name: 'Affidavit', nameEs: 'Declaración Jurada' },
  revocation_poa: { amount: 5900, name: 'Revocation of Power of Attorney', nameEs: 'Revocación de Poder Notarial' },
  authorization_letter: { amount: 4900, name: 'Authorization Letter', nameEs: 'Carta de Autorización' },
  promissory_note: { amount: 8900, name: 'Promissory Note', nameEs: 'Pagaré' },
  guardianship_designation: { amount: 12900, name: 'Guardianship Designation', nameEs: 'Designación de Guardián' },
  travel_authorization: { amount: 4900, name: 'Travel Authorization Letter', nameEs: 'Carta de Autorización de Viaje' },
};

// Tiered pricing for guardianship
const GUARDIANSHIP_TIERS = {
  basic:    { amount: 12900, name: 'Guardian Nomination — Basic', nameEs: 'Nominación de Guardián — Básico' },
  standard: { amount: 19900, name: 'Guardian Nomination — Standard', nameEs: 'Nominación de Guardián — Estándar' },
  premium:  { amount: 29900, name: 'Guardian Nomination — Premium', nameEs: 'Nominación de Guardián — Premium' },
};

const SLUG_MAP = {
  bill_of_sale: 'bill-of-sale',
  affidavit: 'affidavit',
  revocation_poa: 'revocation-poa',
  authorization_letter: 'authorization-letter',
  promissory_note: 'promissory-note',
  guardianship_designation: 'guardianship',
  travel_authorization: 'travel-authorization',
};

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

  try {
    const body = await request.json();
    const { document_type, matter_id, client_name, client_email, language, tier } = body;

    // Use tiered pricing for guardianship, flat pricing for everything else
    let pricing;
    if (document_type === 'guardianship_designation' && tier && GUARDIANSHIP_TIERS[tier]) {
      pricing = GUARDIANSHIP_TIERS[tier];
    } else {
      pricing = PRICING[document_type];
    }
    if (!pricing) {
      return NextResponse.json({ success: false, error: 'Invalid document type' }, { status: 400 });
    }

    const isSpanish = language === 'es';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://multiservicios360.net';
    const slug = SLUG_MAP[document_type] || document_type;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: isSpanish ? pricing.nameEs : pricing.name,
            description: isSpanish
              ? 'Preparación de documento legal - Multi Servicios 360'
              : 'Legal document preparation - Multi Servicios 360',
          },
          unit_amount: pricing.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/simple-doc/success?session_id={CHECKOUT_SESSION_ID}&matter_id=${matter_id}&doc_type=${document_type}`,
      cancel_url: `${baseUrl}/${slug}?canceled=true`,
      customer_email: client_email,
      metadata: {
        matterId: matter_id || '',
        documentType: document_type,
        clientName: client_name,
        language: language,
        tier: tier || '',
        source: 'simple_doc',
      },
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Simple doc checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
