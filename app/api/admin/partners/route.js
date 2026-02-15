import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../../../../lib/send-welcome-email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET() {
  const { data: partners, error } = await supabaseAdmin
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, partners });
}

export async function POST(request) {
  const body = await request.json();
  const { email, password, business_name, contact_name, phone, partner_type, tier, commission_rate, status } = body;

  const referralCode = business_name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data: partner, error } = await supabaseAdmin
    .from('partners')
    .insert({
      email: email.toLowerCase().trim(),
      password_hash: hashPassword(password),
      business_name,
      contact_name,
      phone,
      partner_type: partner_type || 'tax_preparer',
      tier: tier || 'referral',
      commission_rate: commission_rate || 20,
      package_name: body.package_name || 'basic',
      setup_fee_amount: body.setup_fee_amount || 499,
      annual_fee_amount: body.annual_fee_amount || 499,
      status: status || 'active',
      referral_code: referralCode
    })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // Send welcome email with credentials
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';
    await sendWelcomeEmail({
      to: email.toLowerCase().trim(),
      name: contact_name || business_name,
      role: 'partner',
      loginUrl: `${siteUrl}/portal/login`,
      email: email.toLowerCase().trim(),
      password: password,
      setupFee: body.setup_fee_amount || 499,
      membershipUrl: `${siteUrl}/portal/membership`,
    });
  } catch (emailErr) {
    console.error('Partner welcome email error:', emailErr);
  }

  return NextResponse.json({ success: true, partner });
}

export async function PUT(request) {
  const body = await request.json();
  const { id, password, ...updateData } = body;

  if (password && password.trim() !== '') {
    updateData.password_hash = hashPassword(password);
  }

  const { data: partner, error } = await supabaseAdmin
    .from('partners')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, partner });
}