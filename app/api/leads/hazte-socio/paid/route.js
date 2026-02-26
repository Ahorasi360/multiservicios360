export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Called from success page to mark lead as paid (belt-and-suspenders — webhook is primary)
export async function POST(request) {
  try {
    const { ref, package_key } = await request.json();
    if (!ref) return NextResponse.json({ ok: true }); // silent fail is fine

    await supabase.from('partner_leads')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('ref', ref);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: true }); // never break success page
  }
}
