export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '../../../../lib/send-welcome-email';
import crypto from 'crypto';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function checkAuth(request) {
  const pw = request.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD || pw === 'MS360Admin2026!';
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// GET — all sales reps with stats
export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data: reps, error } = await supabase
      .from('sales_reps')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    // Get commission assignments per rep
    const repsWithStats = await Promise.all(
      (reps || []).map(async (rep) => {
        const { data: assignments } = await supabase
          .from('sales_commissions')
          .select('id, partner_id, status, commission_rate, duration_months, start_date, end_date, setup_fee_amount, setup_fee_paid, total_document_sales, total_commission_earned, total_commission_paid')
          .eq('sales_rep_id', rep.id);

        const active = (assignments || []).filter(a => a.status === 'active');
        const totalEarned = (assignments || []).reduce((s, a) => s + Number(a.total_commission_earned || 0), 0);
        const totalPaid = (assignments || []).reduce((s, a) => s + Number(a.total_commission_paid || 0), 0);
        const totalSetupFees = (assignments || []).filter(a => a.setup_fee_paid).reduce((s, a) => s + Number(a.setup_fee_amount || 0), 0);

        return {
          ...rep,
          offices_total: (assignments || []).length,
          offices_active: active.length,
          total_earned: totalEarned + totalSetupFees,
          total_paid: totalPaid,
          pending_payout: (totalEarned + totalSetupFees) - totalPaid,
          assignments: assignments || [],
        };
      })
    );

    return NextResponse.json({ success: true, reps: repsWithStats });
  } catch (err) {
    console.error('Sales GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — create new sales rep
export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, email, phone, password, commission_rate, commission_duration_months, setup_fee_share_enabled, setup_fee_share_percent, notes, status } = body;

    const insertData = {
      name,
      email: email.toLowerCase().trim(),
      phone,
      commission_rate: commission_rate || 5,
      commission_duration_months: commission_duration_months || 1,
      setup_fee_share_enabled: setup_fee_share_enabled || false,
      setup_fee_share_percent: setup_fee_share_percent || 0,
      notes,
      status: status || 'active',
    };
    if (password && password.trim()) insertData.password_hash = hashPassword(password);

    const { data: rep, error } = await supabase
      .from('sales_reps')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Send welcome email if password provided
    if (password && password.trim()) {
      try {
        await sendWelcomeEmail({
          to: email.toLowerCase().trim(),
          name: name,
          role: 'sales',
          loginUrl: 'https://multiservicios360.net/sales/login',
          email: email.toLowerCase().trim(),
          password: password,
        });
      } catch (emailErr) {
        console.error('Sales welcome email error:', emailErr);
      }
    }

    return NextResponse.json({ success: true, rep });
  } catch (err) {
    console.error('Sales POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — update sales rep
export async function PUT(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, password, ...updateData } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (password && password.trim()) updateData.password_hash = hashPassword(password);

    const { data: rep, error } = await supabase
      .from('sales_reps')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, rep });
  } catch (err) {
    console.error('Sales PUT error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove sales rep
export async function DELETE(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    const { error } = await getSupabase().from('sales_reps').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Sales DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
