export const dynamic = 'force-dynamic';
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
  // Estate Planning
  pour_over_will: { amount: 19900, name: 'Pour-Over Will', nameEs: 'Testamento de Traspaso al Fideicomiso' },
  simple_will: { amount: 14900, name: 'Last Will and Testament', nameEs: 'Testamento Simple' },
  hipaa_authorization: { amount: 9900, name: 'HIPAA Authorization', nameEs: 'Autorización HIPAA' },
  certification_of_trust: { amount: 9900, name: 'Certification of Trust', nameEs: 'Certificación de Fideicomiso' },
  // Corporate
  s_corp_formation: { amount: 49900, name: 'S-Corporation Formation Package', nameEs: 'Paquete de Formación S-Corporation' },
  c_corp_formation: { amount: 49900, name: 'C-Corporation Formation Package', nameEs: 'Paquete de Formación C-Corporation' },
  corporate_minutes: { amount: 14900, name: 'Corporate Minutes', nameEs: 'Actas Corporativas' },
  banking_resolution: { amount: 9900, name: 'Banking Resolution', nameEs: 'Resolución Bancaria' },
  // Phase 2
  small_estate_affidavit: { amount: 14900, name: 'Small Estate Affidavit (§13100)', nameEs: 'Declaración Jurada de Sucesión Simplificada (§13100)' },
  quitclaim_deed: { amount: 19900, name: 'Quitclaim Deed', nameEs: 'Escritura de Traspaso (Quitclaim Deed)' },
  contractor_agreement: { amount: 14900, name: 'Independent Contractor Agreement', nameEs: 'Contrato de Contratista Independiente' },
  demand_letter: { amount: 9900, name: 'Demand Letter', nameEs: 'Carta de Demanda de Pago' },
  apostille_letter: { amount: 7900, name: 'Apostille Cover Letter', nameEs: 'Carta de Solicitud de Apostilla' },
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
  pour_over_will: 'pour-over-will',
  simple_will: 'simple-will',
  hipaa_authorization: 'hipaa-authorization',
  certification_of_trust: 'certification-of-trust',
  s_corp_formation: 's-corp-formation',
  c_corp_formation: 'c-corp-formation',
  corporate_minutes: 'corporate-minutes',
  banking_resolution: 'banking-resolution',
  // Phase 2
  small_estate_affidavit: 'small-estate-affidavit',
  quitclaim_deed: 'quitclaim-deed',
  contractor_agreement: 'contractor-agreement',
  demand_letter: 'demand-letter',
  apostille_letter: 'apostille-letter',
};

export async function POST(request) {
  function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }); }

  try {
    const body = await request.json();
    const { document_type, matter_id, client_name, client_email, language, tier, professional_upsell } = body;

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

    const lineItems = [{
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
    }];

    // Add professional coordination as separate line item
    if (professional_upsell) {
      const isCorporate = ['s_corp_formation', 'c_corp_formation', 'corporate_minutes', 'banking_resolution'].includes(document_type);
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: isSpanish
              ? (isCorporate ? 'Coordinación con Abogado Corporativo — Cargo de Plataforma' : 'Coordinación con Abogado — Cargo de Plataforma')
              : (isCorporate ? 'Corporate Attorney Coordination — Platform Fee' : 'Attorney Coordination — Platform Fee'),
            description: isSpanish
              ? 'Cargo de coordinación de plataforma únicamente. Los honorarios del abogado independiente son separados.'
              : 'Platform coordination fee only. Independent attorney fees are charged separately.',
          },
          unit_amount: 19900,
        },
        quantity: 1,
      });
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
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
        professional_upsell: professional_upsell ? 'true' : 'false',
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
