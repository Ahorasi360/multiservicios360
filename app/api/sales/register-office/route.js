// app/api/sales/register-office/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const PACKAGES = {
  basico: { name: 'Paquete Básico', setup_fee: 499, commission_rate: 20 },
  profesional: { name: 'Paquete Profesional', setup_fee: 899, commission_rate: 25 },
  avanzado: { name: 'Paquete Avanzado', setup_fee: 2500, commission_rate: 30 },
};

export async function POST(request) {
  try {
    const repId = request.headers.get('x-sales-id');
    if (!repId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify sales rep exists
    const { data: rep } = await supabase
      .from('sales_reps')
      .select('id, name')
      .eq('id', repId)
      .single();
    if (!rep) return NextResponse.json({ error: 'Sales rep not found' }, { status: 404 });

    const body = await request.json();
    const { business_name, contact_name, email, phone, partner_type, package_key } = body;

    if (!business_name || !email || !package_key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pkg = PACKAGES[package_key];
    if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 });

    // Check if email already exists
    const { data: existing } = await supabase
      .from('partners')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();
    if (existing) return NextResponse.json({ error: 'An office with this email already exists' }, { status: 409 });

    // Generate temp password
    const tempPassword = crypto.randomBytes(4).toString('hex');
    const referralCode = business_name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create partner with status pending_payment
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: hashPassword(tempPassword),
        business_name,
        contact_name: contact_name || '',
        phone: phone || '',
        partner_type: partner_type || 'tax_preparer',
        tier: package_key,
        commission_rate: pkg.commission_rate,
        package_name: package_key,
        setup_fee_amount: pkg.setup_fee,
        annual_fee_amount: pkg.setup_fee,
        status: 'pending_payment',
        referral_code: referralCode,
        registered_by_rep: repId,
        temp_password: tempPassword,
      })
      .select()
      .single();

    if (partnerError) {
      console.error('Partner creation error:', partnerError);
      return NextResponse.json({ error: partnerError.message }, { status: 500 });
    }

    // Create Stripe Checkout session for setup fee
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Multi Servicios 360 - ${pkg.name}`,
            description: `Setup fee for ${business_name} - Partner Program`,
          },
          unit_amount: pkg.setup_fee * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/sales/register-office/success?partner_id=${partner.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/sales/register-office?cancelled=true`,
      customer_email: email.toLowerCase().trim(),
      metadata: {
        type: 'partner_setup_fee',
        partner_id: partner.id,
        sales_rep_id: repId,
        package_key,
        business_name,
      },
      payment_intent_data: {
        metadata: {
          type: 'partner_setup_fee',
          partner_id: partner.id,
        }
      }
    });

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      partner_id: partner.id,
    });

  } catch (error) {
    console.error('Register office error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: List offices registered by this sales rep
export async function GET(request) {
  try {
    const repId = request.headers.get('x-sales-id');
    if (!repId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: partners } = await supabase
      .from('partners')
      .select('id, business_name, contact_name, email, phone, status, package_name, setup_fee_amount, created_at')
      .eq('registered_by_rep', repId)
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, offices: partners || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
