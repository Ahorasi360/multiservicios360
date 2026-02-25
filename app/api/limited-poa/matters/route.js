export const dynamic = 'force-dynamic';
﻿import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      client_name,
      client_email,
      client_phone, partner_id,
      review_tier,
      intake_data,
      language,
      selected_addons,
      poa_category,
    } = body;

    const { data, error } = await supabase
      .from('limited_poa_matters')
      .insert([
        {
          client_name,
          client_email,
          client_phone,
          review_tier: review_tier || 'draft_only',
          intake_data,
          language: language || 'en',
          selected_addons: selected_addons || [],
          poa_category: poa_category || 'real_estate',
          status: 'draft',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, matter: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
