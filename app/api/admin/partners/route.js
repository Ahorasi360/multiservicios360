export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../../../../lib/send-welcome-email';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function checkAuth(request) {
  const pw = request.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data: partners, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, partners });
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { email, password, business_name, contact_name, phone, partner_type, tier, commission_rate, status } = body;

  const referralCode = business_name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data: partner, error } = await supabase
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
  if (!checkAuth(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { id, password, ...updateData } = body;

  if (password && password.trim() !== '') {
    updateData.password_hash = hashPassword(password);
  }

  // If approving a paid_pending_approval partner, send welcome email
  let shouldSendWelcome = false;
  let partnerBefore = null;
  if (updateData.status === 'active') {
    const { data: existing } = await supabase
      .from('partners')
      .select('id, status, email, contact_name, business_name, temp_password, setup_fee_amount, registered_by_rep')
      .eq('id', id)
      .single();
    if (existing?.status === 'paid_pending_approval') {
      shouldSendWelcome = true;
      partnerBefore = existing;
    }
  }

  const { data: partner, error } = await supabase
    .from('partners')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // Send welcome email with credentials when approving
  if (shouldSendWelcome && partnerBefore) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';
      await sendWelcomeEmail({
        to: partnerBefore.email,
        name: partnerBefore.contact_name || partnerBefore.business_name,
        role: 'partner',
        loginUrl: `${siteUrl}/portal/login`,
        email: partnerBefore.email,
        password: partnerBefore.temp_password || 'Contact admin for password',
        setupFee: partnerBefore.setup_fee_amount || 499,
        membershipUrl: `${siteUrl}/portal/membership`,
      });
      console.log('Welcome email sent to approved partner:', partnerBefore.email);

      // If registered by a sales rep, create the sales commission assignment
      if (partnerBefore.registered_by_rep) {
        const { data: repData } = await supabase
          .from('sales_reps')
          .select('id, commission_rate, commission_duration_months')
          .eq('id', partnerBefore.registered_by_rep)
          .single();

        if (repData) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + (repData.commission_duration_months || 1));

          await supabase.from('sales_commissions').insert({
            sales_rep_id: repData.id,
            partner_id: id,
            commission_rate: repData.commission_rate || 5,
            duration_months: repData.commission_duration_months || 1,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'active',
          });
          console.log('Sales commission created for rep:', repData.id);
        }
      }
    } catch (emailErr) {
      console.error('Welcome email / commission error:', emailErr);
    }
  }

  return NextResponse.json({ success: true, partner });
}
export async function DELETE(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
