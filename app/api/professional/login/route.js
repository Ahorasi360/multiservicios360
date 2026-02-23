export const dynamic = 'force-dynamic';
// app/api/professional/login/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const { data: prof, error } = await supabase
      .from('professionals')
      .select('id, name, email, profession, specialty, status')
      .eq('email', email.toLowerCase().trim())
      .eq('password_hash', hashPassword(password))
      .single();

    if (error || !prof) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (prof.status !== 'active') return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });

    return NextResponse.json({ success: true, professional: prof });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
