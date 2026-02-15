// app/api/staff/login/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const { data: worker, error } = await supabase
      .from('staff_workers')
      .select('id, name, email, role, status')
      .eq('email', email.toLowerCase().trim())
      .eq('password_hash', hashPassword(password))
      .single();

    if (error || !worker) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (worker.status !== 'active') return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });

    // Update last login
    await supabase.from('staff_workers').update({ last_login: new Date().toISOString() }).eq('id', worker.id);

    return NextResponse.json({ success: true, worker });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
