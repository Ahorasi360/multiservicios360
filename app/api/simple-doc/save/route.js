export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { document_type, client_name, client_email, client_phone, partner_code, form_data, language, tier } = body;

    if (!document_type || !client_name || !client_email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Inject tier into form_data for guardianship
    const finalFormData = { ...form_data };
    if (tier && document_type === 'guardianship_designation') {
      finalFormData.tier = tier;
    }

    // Look up partner if code provided
    let partner_id = null;
    if (partner_code) {
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('partner_code', partner_code.toUpperCase())
        .eq('status', 'active')
        .single();
      if (partner) partner_id = partner.id;
    }

    const { data, error } = await supabase
      .from('simple_doc_matters')
      .insert({
        document_type,
        client_name,
        client_email,
        client_phone: client_phone || null,
        partner_id,
        partner_code: partner_code || null,
        form_data: finalFormData,
        language: language || 'es',
        status: 'draft',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, matterId: data.id });
  } catch (error) {
    console.error('Save simple doc error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
