export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/drafts?email=x&doc_type=y  — retrieve existing draft
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase().trim();
    const doc_type = searchParams.get('doc_type');

    if (!email || !doc_type) {
      return NextResponse.json({ draft: null });
    }

    const { data, error } = await supabase
      .from('document_drafts')
      .select('*')
      .eq('email', email)
      .eq('doc_type', doc_type)
      .eq('completed', false)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ draft: data || null });
  } catch (err) {
    console.error('Draft GET error:', err);
    return NextResponse.json({ draft: null });
  }
}

// POST /api/drafts — save/update draft
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      doc_type,
      language = 'es',
      client_name,
      intake_data = {},
      current_question_index = 0,
      messages = [],
      step = 'intake',
      partner_code,
    } = body;

    if (!email || !doc_type) {
      return NextResponse.json({ error: 'email and doc_type required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Upsert — update if exists, insert if not
    const { data, error } = await supabase
      .from('document_drafts')
      .upsert(
        {
          email: normalizedEmail,
          doc_type,
          language,
          client_name,
          intake_data,
          current_question_index,
          messages,
          step,
          partner_code,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email,doc_type',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      // Fallback: try update then insert
      const { data: existing } = await supabase
        .from('document_drafts')
        .select('id')
        .eq('email', normalizedEmail)
        .eq('doc_type', doc_type)
        .eq('completed', false)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('document_drafts')
          .update({
            language,
            client_name,
            intake_data,
            current_question_index,
            messages,
            step,
            partner_code,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('document_drafts').insert({
          email: normalizedEmail,
          doc_type,
          language,
          client_name,
          intake_data,
          current_question_index,
          messages,
          step,
          partner_code,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Draft POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/drafts — mark as completed
export async function PATCH(request) {
  try {
    const { email, doc_type } = await request.json();
    if (!email || !doc_type) return NextResponse.json({ success: false });

    await supabase
      .from('document_drafts')
      .update({ completed: true, updated_at: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim())
      .eq('doc_type', doc_type);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
