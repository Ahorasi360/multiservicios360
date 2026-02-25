export const dynamic = 'force-dynamic';
// app/api/portal/stats/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');
    if (!partnerId) return NextResponse.json({ success: false, error: 'Partner ID is required' }, { status: 400 });

    const { data: partner } = await getSupabase().from('partners').select('commission_rate').eq('id', partnerId).single();
    const commissionRate = (partner?.commission_rate || 20) / 100;

    const tables = ['poa_matters','limited_poa_matters','trust_matters','llc_matters','simple_doc_matters'];
    let totalDocuments = 0, totalRevenue = 0, thisMonthDocuments = 0, thisMonthRevenue = 0;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const clientEmails = new Set();
    let recentDocs = [];

    for (const table of tables) {
      const { data } = await getSupabase().from(table).select('client_name, client_email, total_price, created_at, status').eq('partner_id', partnerId);
      if (data) {
        totalDocuments += data.length;
        data.forEach(d => { if (d.client_email) clientEmails.add(d.client_email); });
        const paid = data.filter(d => d.status === 'paid' || d.status === 'completed');
        totalRevenue += paid.reduce((sum, d) => sum + (parseFloat(d.total_price) || 0), 0);
        const thisMonth = paid.filter(d => new Date(d.created_at) >= thisMonthStart);
        thisMonthDocuments += data.filter(d => new Date(d.created_at) >= thisMonthStart).length;
        thisMonthRevenue += thisMonth.reduce((sum, d) => sum + (parseFloat(d.total_price) || 0), 0);
        recentDocs.push(...data.map(d => ({ ...d, _table: table })));
      }
    }

    const { data: referrals } = await getSupabase().from('partner_referrals').select('commission_amount, status, created_at').eq('partner_id', partnerId);
    let totalEarnings = referrals?.reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0) || 0;
    let pendingPayout = referrals?.filter(r => r.status === 'pending').reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0) || 0;
    let totalPaid = referrals?.filter(r => r.status === 'paid').reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0) || 0;
    if (totalEarnings === 0 && totalRevenue > 0) { totalEarnings = totalRevenue * commissionRate; pendingPayout = totalEarnings; }
    const thisMonthEarnings = referrals?.filter(r => new Date(r.created_at) >= thisMonthStart).reduce((sum, r) => sum + (parseFloat(r.commission_amount) || 0), 0) || (thisMonthRevenue * commissionRate);

    const { count: registeredClients } = await getSupabase().from('partner_clients').select('*', { count: 'exact', head: true }).eq('partner_id', partnerId);
    const totalClients = Math.max(clientEmails.size, registeredClients || 0);

    recentDocs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({
      success: true,
      stats: { totalClients, totalDocuments, totalEarnings, pendingPayout, totalPaid, thisMonthEarnings, thisMonthDocuments },
      recentClients: recentDocs.slice(0, 5),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
