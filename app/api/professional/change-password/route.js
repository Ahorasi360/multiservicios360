export const dynamic = 'force-dynamic';
// app/api/professional/change-password/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { professional_id, current_password, new_password } = await request.json();
    if (!professional_id || !current_password || !new_password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    if (new_password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const { data: prof } = await supabase
      .from('professionals')
      .select('id')
      .eq('id', professional_id)
      .eq('password_hash', hashPassword(current_password))
      .single();

    if (!prof) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });

    await supabase.from('professionals').update({ password_hash: hashPassword(new_password) }).eq('id', professional_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
