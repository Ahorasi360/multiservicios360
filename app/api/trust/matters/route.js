import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
      attorney_flags
    } = body;

    // Validate required fields
    if (!client_name || !client_email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    // Insert into trust_matters table
    const { data: matter, error } = await supabase
      .from('trust_matters')
      .insert({
        partner_id: partner_id || null,
        client_name,
        client_email,
        client_phone: client_phone || null,
        review_tier,
        intake_data,
        language: language || 'es',
        selected_addons: selected_addons || [],
        attorney_flags: attorney_flags || [],
        status: 'pending_payment',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, matter });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
