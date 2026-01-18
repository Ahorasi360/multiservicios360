import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      tier, 
      addons, 
      clientName, 
      clientEmail, 
      intakeData,
      language,
      matterId 
    } = body;

    // Calculate prices
    const tierPrices = {
      draft_only: { amount: 14900, name: 'POA - Draft Only', nameEs: 'POA - Solo Borrador' },
      attorney_review_silent: { amount: 34900, name: 'POA - Attorney Review', nameEs: 'POA - Revision de Abogado' },
      attorney_review_call: { amount: 49900, name: 'POA - Attorney Review + Call', nameEs: 'POA - Revision + Consulta' },
    };

    const addonPrices = {
      notary: { amount: 15000, name: 'Notary Coordination', nameEs: 'Coordinacion de Notario' },
      recording: { amount: 25000, name: 'Recording Coordination', nameEs: 'Coordinacion de Registro' },
      amendment: { amount: 9900, name: 'Future Amendments Credit', nameEs: 'Credito para Enmiendas' },
    };

    // Build line items
    const lineItems = [];
    const isSpanish = language === 'es';

    // Add tier
    const selectedTier = tierPrices[tier] || tierPrices.draft_only;
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: isSpanish ? selectedTier.nameEs : selectedTier.name,
          description: isSpanish 
            ? 'Poder Notarial de California' 
            : 'California Power of Attorney',
        },
        unit_amount: selectedTier.amount,
      },
      quantity: 1,
    });

    // Add addons
    if (addons && addons.length > 0) {
      addons.forEach(addonId => {
        const addon = addonPrices[addonId];
        if (addon) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: isSpanish ? addon.nameEs : addon.name,
              },
              unit_amount: addon.amount,
            },
            quantity: 1,
          });
        }
      });
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
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
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}