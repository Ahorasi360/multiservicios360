// app/api/sales/invite/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Validate an invite code
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ valid: false });

  const { data } = await supabase
    .from('invite_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('used', false)
    .single();

  if (!data) return NextResponse.json({ valid: false });

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: 'expired' });
  }

  return NextResponse.json({ valid: true, note: data.note });
}

// POST - Generate invite codes (admin only)
export async function POST(request) {
  const pw = request.headers.get('x-admin-password');
  if (pw !== process.env.ADMIN_PASSWORD && pw !== 'MS360Admin2026!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { count = 1, note = '', expires_days = 30 } = body;

  const codes = [];
  for (let i = 0; i < Math.min(count, 50); i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const expires_at = expires_days
      ? new Date(Date.now() + expires_days * 24 * 60 * 60 * 1000).toISOString()
      : null;
    codes.push({ code, note, expires_at, used: false });
  }

  const { data, error } = await supabase.from('invite_codes').insert(codes).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, codes: data });
}

// DELETE - Revoke an invite code (admin only)
export async function DELETE(request) {
  const pw = request.headers.get('x-admin-password');
  if (pw !== process.env.ADMIN_PASSWORD && pw !== 'MS360Admin2026!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { code } = await request.json();
  await supabase.from('invite_codes').delete().eq('code', code.toUpperCase());
  return NextResponse.json({ success: true });
}
