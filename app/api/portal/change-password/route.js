export const dynamic = 'force-dynamic';
// app/api/portal/change-password/route.js
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
    const { partner_id, current_password, new_password } = await request.json();
    if (!partner_id || !current_password || !new_password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (new_password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

    const { data: partner } = await supabase
      .from('partners')
      .select('id')
      .eq('id', partner_id)
      .eq('password_hash', hashPassword(current_password))
      .single();

    if (!partner) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });

    await getSupabase().from('partners').update({ password_hash: hashPassword(new_password) }).eq('id', partner_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
