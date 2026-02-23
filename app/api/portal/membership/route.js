export const dynamic = 'force-dynamic';
// app/api/portal/membership/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const partnerId = url.searchParams.get('partner_id');
    if (!partnerId) return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });

    // Get partner membership info
    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('id, business_name, contact_name, email, package_name, setup_fee_amount, setup_fee_paid, setup_fee_paid_at, annual_fee_amount, annual_fee_waived, annual_fee_waived_reason, membership_expires_at, tier, status')
      .eq('id', partnerId)
      .single();

    if (pErr || !partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    // Get payment history
    const { data: payments } = await supabase
      .from('partner_payments')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    // Determine membership status
    let membershipStatus = 'inactive';
    if (partner.setup_fee_paid) {
      if (partner.membership_expires_at && new Date(partner.membership_expires_at) > new Date()) {
        membershipStatus = 'active';
      } else if (partner.membership_expires_at && new Date(partner.membership_expires_at) <= new Date()) {
        membershipStatus = 'expired';
      } else {
        membershipStatus = 'active'; // paid but no expiry set = lifetime
      }
    } else {
      membershipStatus = 'pending_setup';
    }

    return NextResponse.json({
      success: true,
      membership: {
        ...partner,
        membership_status: membershipStatus,
        days_until_expiry: partner.membership_expires_at
          ? Math.max(0, Math.ceil((new Date(partner.membership_expires_at) - new Date()) / (1000 * 60 * 60 * 24)))
          : null,
      },
      payments: payments || [],
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
