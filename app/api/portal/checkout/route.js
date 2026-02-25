export const dynamic = 'force-dynamic';
// app/api/portal/checkout/route.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }); }
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';

export async function POST(request) {
  try {
    const { partner_id, payment_type } = await request.json();

    if (!partner_id) return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });

    // Get partner info
    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('*')
      .eq('id', partner_id)
      .single();

    if (pErr || !partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    // Determine amount and description
    let amount, description;
    const type = payment_type || 'setup_fee';

    if (type === 'setup_fee') {
      if (partner.setup_fee_paid) return NextResponse.json({ error: 'Setup fee already paid' }, { status: 400 });
      amount = Number(partner.setup_fee_amount || 499);
      description = `Setup Fee — ${partner.package_name || 'Partner'} Package`;
    } else if (type === 'annual_renewal') {
      amount = Number(partner.annual_fee_amount || partner.setup_fee_amount || 499);
      description = `Annual Renewal — ${partner.package_name || 'Partner'} Package`;
    } else {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId = partner.stripe_customer_id;
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: partner.email,
        name: partner.business_name || partner.contact_name,
        metadata: { partner_id: partner.id },
      });
      customerId = customer.id;
      await getSupabase().from('partners').update({ stripe_customer_id: customerId }).eq('id', partner.id);
    }

    // Create payment record
    const { data: payment } = await supabase
      .from('partner_payments')
      .insert({
        partner_id: partner.id,
        payment_type: type,
        amount,
        description,
        status: 'pending',
      })
      .select()
      .single();

    // Create Stripe checkout session
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
            description: `Multi Servicios 360 — ${partner.business_name || 'Partner Office'}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      metadata: {
        partner_id: partner.id,
        payment_id: payment?.id || '',
        payment_type: type,
      },
      success_url: `${SITE_URL}/portal/membership?success=true&type=${type}`,
      cancel_url: `${SITE_URL}/portal/membership?cancelled=true`,
    });

    // Store session ID
    if (payment) {
      await getSupabase().from('partner_payments').update({ stripe_session_id: session.id }).eq('id', payment.id);
    }

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Partner checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
