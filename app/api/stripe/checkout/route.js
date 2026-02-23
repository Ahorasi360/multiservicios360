export const dynamic = 'force-dynamic';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }); }

export async function POST(request) {
  try {
    const body = await request.json();
    const { tier, addons, clientName, clientEmail, intakeData, language, matterId } = body;

    const tierPrices = {
      draft_only: { amount: 14900, name: 'General POA - Self-Prepared Document', nameEs: 'POA General - Documento Autopreparado' },
      attorney_review_silent: { amount: 34900, name: 'General POA - Professional Review', nameEs: 'POA General - Revision Profesional' },
      attorney_review_call: { amount: 49900, name: 'General POA - Professional Consultation', nameEs: 'POA General - Consulta Profesional' },
    };

    const addonPrices = {
      notary: { amount: 15000, name: 'Notary Coordination', nameEs: 'Coordinacion de Notario' },
      recording: { amount: 25000, name: 'Recording Coordination', nameEs: 'Coordinacion de Registro' },
      amendment: { amount: 9900, name: 'Future Amendments Credit', nameEs: 'Credito para Enmiendas' },
    };

    const lineItems = [];
    const isSpanish = language === 'es';

    const selectedTier = tierPrices[tier] || tierPrices.draft_only;
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: isSpanish ? selectedTier.nameEs : selectedTier.name,
          description: isSpanish ? 'Poder Notarial General de California' : 'California General Power of Attorney',
        },
        unit_amount: selectedTier.amount,
      },
      quantity: 1,
    });

    if (addons && addons.length > 0) {
      addons.forEach(addonId => {
        const addon = addonPrices[addonId];
        if (addon) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: isSpanish ? addon.nameEs : addon.name },
              unit_amount: addon.amount,
            },
            quantity: 1,
          });
        }
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://multiservicios360.vercel.app';

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/poa/success?session_id={CHECKOUT_SESSION_ID}&matter_id=${matterId}`,
      cancel_url: `${baseUrl}/poa?canceled=true`,
      customer_email: clientEmail,
      metadata: {
        matterId: matterId || '',
        tier: tier,
        addons: JSON.stringify(addons || []),
        clientName: clientName,
        language: language,
        documentType: 'general_poa',
      },
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}