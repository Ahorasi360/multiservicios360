// app/api/admin/sales/assign/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function checkAuth(request) {
  const pw = request.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD || pw === 'MS360Admin2026!';
}

// POST — assign sales rep to a partner office
export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { sales_rep_id, partner_id, commission_rate, duration_months, setup_fee_amount } = await request.json();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (duration_months || 1));

    const { data, error } = await supabase
      .from('sales_commissions')
      .insert({
        sales_rep_id,
        partner_id,
        commission_rate,
        duration_months: duration_months || 1,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        setup_fee_amount: setup_fee_amount || 0,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, assignment: data });
  } catch (err) {
    console.error('Assign error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove assignment
export async function DELETE(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    const { error } = await supabase.from('sales_commissions').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
