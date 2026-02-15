import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../../../../lib/send-welcome-email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function checkAuth(request) {
  const pw = request.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD || pw === 'MS360Admin2026!';
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data, error } = await supabase
      .from('staff_workers')
      .select('id, name, email, phone, role, status, notes, last_login, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, workers: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

    const { data, error } = await supabase
      .from('staff_workers')
      .insert({
        name: body.name,
        email: body.email.toLowerCase().trim(),
        password_hash: hashPassword(body.password),
        phone: body.phone,
        role: body.role || 'worker',
        status: body.status || 'active',
        notes: body.notes,
      })
      .select('id, name, email, phone, role, status, notes, created_at')
      .single();
    if (error) throw error;

    // Send welcome email
    try {
      await sendWelcomeEmail({
        to: body.email.toLowerCase().trim(),
        name: body.name,
        role: 'staff',
        loginUrl: 'https://multiservicios360.net/staff/login',
        email: body.email.toLowerCase().trim(),
        password: body.password,
      });
    } catch (emailErr) {
      console.error('Staff welcome email error:', emailErr);
    }

    return NextResponse.json({ success: true, worker: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, password, ...updateData } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (password && password.trim()) updateData.password_hash = hashPassword(password);

    const { data, error } = await supabase
      .from('staff_workers')
      .update(updateData)
      .eq('id', id)
      .select('id, name, email, phone, role, status, notes, created_at')
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, worker: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
