import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TIER_PRICES = {
  draft_only: 149,
  attorney_review_silent: 349,
  attorney_review_call: 499,
};

const ADDON_PRICES = {
  notary: 150,
  recording: 250,
  amendment: 99,
};

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('=== POA API REQUEST ===', JSON.stringify(body, null, 2));
    
    const {
      client_name,
      client_email,
      client_phone, partner_id,
      review_tier,
      intake_data,
      language,
      selected_addons = [],
    } = body;

    if (!client_name || !client_email || !intake_data || !review_tier) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tier_price = TIER_PRICES[review_tier] || 149;
    let addons_total = 0;
    const addon_notary = selected_addons.includes('notary');
    const addon_recording = selected_addons.includes('recording');
    const addon_amendment = selected_addons.includes('amendment');

    if (addon_notary) addons_total += ADDON_PRICES.notary;
    if (addon_recording) addons_total += ADDON_PRICES.recording;
    if (addon_amendment) addons_total += ADDON_PRICES.amendment;

    const total_price = tier_price + addons_total;

    const { data: matter, error } = await supabase
      .from('poa_matters')
      .insert({
        partner_id: partner_id || null,
        client_name,
        client_email,
        client_phone: client_phone || null,
        review_tier,
        status: 'pending_payment',
        intake_data,
        tier_price,
        addons_total,
        total_price,
        addon_notary,
        addon_recording,
        addon_amendment,
        language: language || 'es',
      })
      .select()
      .single();

    console.log('=== SUPABASE RESPONSE ===', { matter, error });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    await supabase.from('poa_audit_log').insert({
      matter_id: matter.id,
      action: 'matter_created',
      new_value: { review_tier, status: 'pending_payment', total_price },
    });

    return NextResponse.json({
      success: true,
      matter: matter,
      message: 'POA matter created successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { data: matters, error } = await supabase
      .from('poa_matters')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      matters,
      count: matters.length
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
