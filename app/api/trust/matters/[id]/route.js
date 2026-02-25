export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Matter ID required' }, { status: 400 });
    }

    const { data: matter, error } = await supabase
      .from('trust_matters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!matter) {
      return NextResponse.json({ success: false, error: 'Matter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, matter });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Matter ID required' }, { status: 400 });
    }

    const body = await request.json();

    // Only allow specific fields to be updated (whitelist)
    const allowedFields = [
      'electronic_signature',
      'signed_at_utc',
      'signed_at_local',
      'execution_date',
      'documents_generated',
      'document_generated_at',
      'status'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    const { data: matter, error } = await supabase
      .from('trust_matters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, matter });

  } catch (error) {
    console.error('API PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}