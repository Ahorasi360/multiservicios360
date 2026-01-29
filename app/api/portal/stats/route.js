// app/api/portal/stats/route.js

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

    // Get total clients
    const { count: totalClients } = await supabase
      .from('partner_clients')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partnerId);

    // Get recent clients (last 5)
    const { data: recentClients } = await supabase
      .from('partner_clients')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get referrals/commissions
    const { data: referrals } = await supabase
      .from('partner_referrals')
      .select('*')
      .eq('partner_id', partnerId);

    // Calculate stats
    const totalDocuments = referrals?.length || 0;
    const totalEarnings = referrals?.reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0) || 0;
    const pendingPayout = referrals
      ?.filter(r => r.status === 'pending')
      ?.reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0) || 0;
    const totalPaid = referrals
      ?.filter(r => r.status === 'paid')
      ?.reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0) || 0;

    // This month's stats
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthReferrals = referrals?.filter(r => new Date(r.created_at) >= thisMonthStart) || [];
    const thisMonthEarnings = thisMonthReferrals.reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0);
    const thisMonthDocuments = thisMonthReferrals.length;

    return NextResponse.json({
      success: true,
      stats: {
        totalClients: totalClients || 0,
        totalDocuments,
        totalEarnings,
        pendingPayout,
        totalPaid,
        thisMonthEarnings,
        thisMonthDocuments
      },
      recentClients: recentClients || []
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}