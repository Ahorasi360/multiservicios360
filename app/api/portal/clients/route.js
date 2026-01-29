// app/api/portal/clients/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - Fetch all clients for a partner
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    const { data: clients, error } = await supabase
      .from('partner_clients')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch clients error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch clients' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clients: clients || []
    });

  } catch (error) {
    console.error('Clients GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new client
export async function POST(request) {
  try {
    const body = await request.json();
    const { partner_id, client_name, client_email, client_phone, language_preference } = body;

    if (!partner_id) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    if (!client_name || client_name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Client name is required' },
        { status: 400 }
      );
    }

    // Verify partner exists and is active
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('id, status')
      .eq('id', partner_id)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json(
        { success: false, error: 'Invalid partner' },
        { status: 400 }
      );
    }

    if (partner.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Partner account is not active' },
        { status: 403 }
      );
    }

    // Create the client
    const { data: newClient, error: insertError } = await supabase
      .from('partner_clients')
      .insert({
        partner_id,
        client_name: client_name.trim(),
        client_email: client_email?.trim().toLowerCase() || null,
        client_phone: client_phone?.trim() || null,
        language_preference: language_preference || 'es'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert client error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create client' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      client: newClient
    });

  } catch (error) {
    console.error('Clients POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}