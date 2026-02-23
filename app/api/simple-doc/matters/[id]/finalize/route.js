import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { execution_date, electronic_signature, signed_at_utc, signed_at_local, document_version_id } = body;

    const { error } = await supabase
      .from('simple_doc_matters')
      .update({
        execution_date,
        electronic_signature,
        signed_at_utc,
        signed_at_local,
        document_version_id,
        finalized_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Finalize simple doc error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
