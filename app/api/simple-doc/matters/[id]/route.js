import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data: matter, error } = await supabase
      .from('simple_doc_matters')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !matter) {
      return NextResponse.json({ success: false, error: 'Matter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, matter });
  } catch (error) {
    console.error('Fetch simple doc matter error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
