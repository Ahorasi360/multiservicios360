// app/api/portal/earnings/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    // Get all referrals/commissions for this partner
    const { data: referrals, error: referralsError } = await supabase
      .from('partner_referrals')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (referralsError) {
      console.error('Fetch referrals error:', referralsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch earnings' },
        { status: 500 }
      );
    }

    // Get client names for each referral
    const clientIds = [...new Set(referrals?.map(r => r.client_id).filter(Boolean))];
    
    let clientsMap = {};
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from('partner_clients')
        .select('id, client_name')
        .in('id', clientIds);
      
      clients?.forEach(c => {
        clientsMap[c.id] = c;
      });
    }

    // Build earnings list with client names
    const earnings = (referrals || []).map(referral => ({
      id: referral.id,
      client_id: referral.client_id,
      client_name: clientsMap[referral.client_id]?.client_name || 'Unknown Client',
      document_type: referral.document_type,
      document_id: referral.document_id,
      sale_amount: parseFloat(referral.sale_amount) || 0,
      commission_amount: parseFloat(referral.commission_amount) || 0,
      payment_method: referral.payment_method,
      status: referral.status,
      paid_at: referral.paid_at,
      created_at: referral.created_at
    }));

    // Calculate stats
    const totalEarned = earnings.reduce((sum, e) => sum + e.commission_amount, 0);
    const pendingPayout = earnings
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.commission_amount, 0);
    const totalPaid = earnings
      .filter(e => e.status === 'paid')
      .reduce((sum, e) => sum + e.commission_amount, 0);

    // This month's earnings
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEarnings = earnings
      .filter(e => new Date(e.created_at) >= thisMonthStart)
      .reduce((sum, e) => sum + e.commission_amount, 0);

    // Last month's earnings
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthEarnings = earnings
      .filter(e => {
        const date = new Date(e.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      })
      .reduce((sum, e) => sum + e.commission_amount, 0);

    return NextResponse.json({
      success: true,
      earnings,
      stats: {
        totalEarned,
        pendingPayout,
        totalPaid,
        thisMonthEarnings,
        lastMonthEarnings
      }
    });

  } catch (error) {
    console.error('Earnings GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}