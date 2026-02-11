// app/api/llc/matters/route.js
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
      filing_speed,
      attorney_flags
    } = body;

    // Validate required fields
    if (!client_name || !client_email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Calculate pricing snapshot
    const tierPrices = { llc_standard: 799, llc_plus: 1199, llc_elite: 1699 };
    const upsellPrices = {
      rush_prep: 149,
      oa_amendment: 199,
      soi_amendment: 75,
      registered_agent: 199,
      certified_copy: 99
    };
    const stateFees = { standard: 70, expedite_24hr: 350, expedite_same_day: 750 };

    const tier_price = tierPrices[review_tier] || 799;
    const entity_vault_price = 99; // mandatory
    const addons_total = (selected_addons || []).reduce((sum, id) => sum + (upsellPrices[id] || 0), 0);
    const state_fee = stateFees[filing_speed] || 70;
    const total_price = tier_price + entity_vault_price + addons_total + state_fee;

    const { data, error } = await supabase
      .from('llc_matters')
      .insert({
        partner_id: partner_id || null,
        client_name,
        client_email,
        client_phone: client_phone || null,
        review_tier: review_tier || 'llc_standard',
        intake_data: intake_data || {},
        language: language || 'en',
        selected_addons: selected_addons || [],
        filing_speed: filing_speed || 'standard',
        attorney_flags: attorney_flags || [],
        tier_price,
        entity_vault_price,
        addons_total,
        state_fee,
        total_price,
        payment_status: 'pending_payment'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, matter: data });
  } catch (err) {
    console.error('LLC matters API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - retrieve matter by ID (used by success page)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Matter ID required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('llc_matters')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Matter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, matter: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// PATCH - update matter (signature audit trail)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Matter ID required' },
        { status: 400 }
      );
    }

    // Whitelist allowed fields
    const allowedFields = [
      'electronic_signature',
      'signed_at_utc',
      'signed_at_local',
      'execution_date',
      'documents_generated',
      'document_generated_at',
      'payment_status',
      'status'
    ];

    const safeUpdates = {};
    for (const field of allowedFields) {
      if (updates?.[field] !== undefined) {
        safeUpdates[field] = updates[field];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    safeUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('llc_matters')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('LLC matter PATCH error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, matter: data });
  } catch (err) {
    console.error('LLC matters PATCH error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}