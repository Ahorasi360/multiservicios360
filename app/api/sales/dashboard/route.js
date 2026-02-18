// app/api/sales/dashboard/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const repId = request.headers.get('x-sales-id');
    if (!repId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get rep info (exclude setup fee fields)
    const { data: rep, error } = await supabase
      .from('sales_reps')
      .select('id, name, email, phone, status, commission_rate, commission_duration_months, created_at')
      .eq('id', repId)
      .single();

    if (error || !rep) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Get assignments
    const { data: assignments } = await supabase
      .from('sales_commissions')
      .select('id, partner_id, commission_rate, duration_months, start_date, end_date, total_document_sales, total_commission_earned, total_commission_paid, status')
      .eq('sales_rep_id', repId)
      .order('created_at', { ascending: false });

    // Get partner names for assignments
    const partnerIds = (assignments || []).map(a => a.partner_id).filter(Boolean);
    let partners = {};
    if (partnerIds.length > 0) {
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id, business_name')
        .in('id', partnerIds);
      (partnerData || []).forEach(p => { partners[p.id] = p.business_name; });
    }

    const enrichedAssignments = (assignments || []).map(a => ({
      ...a,
      business_name: partners[a.partner_id] || 'Office',
      is_active: a.status === 'active' && new Date(a.end_date) > new Date(),
    }));

    const totalEarned = enrichedAssignments.reduce((s, a) => s + Number(a.total_commission_earned || 0), 0);
    const totalPaid = enrichedAssignments.reduce((s, a) => s + Number(a.total_commission_paid || 0), 0);
    const activeOffices = enrichedAssignments.filter(a => a.is_active).length;

    return NextResponse.json({
      success: true,
      rep,
      assignments: enrichedAssignments,
      stats: {
        total_offices: enrichedAssignments.length,
        active_offices: activeOffices,
        total_earned: totalEarned,
        total_paid: totalPaid,
        pending: totalEarned - totalPaid,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
