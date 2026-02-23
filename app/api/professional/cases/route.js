export const dynamic = 'force-dynamic';
// app/api/professional/cases/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function checkAuth(request) {
  const profId = request.headers.get('x-professional-id');
  return profId && profId.length > 10 ? profId : null;
}

// GET — all assigned cases for this professional
export async function GET(request) {
  const profId = checkAuth(request);
  if (!profId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';

    let query = supabase
      .from('professional_assignments')
      .select('*')
      .eq('professional_id', profId)
      .order('assigned_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    // Get vault info for each case
    const casesWithVault = await Promise.all(
      (data || []).map(async (c) => {
        // Try to find vault token for this matter
        const { data: vault } = await supabase
          .from('vault_tokens')
          .select('id, token, client_name, client_email')
          .eq('matter_id', c.matter_id)
          .single();

        // Count documents if vault exists
        let docCount = 0;
        if (vault) {
          const { count } = await supabase
            .from('vault_documents')
            .select('*', { count: 'exact', head: true })
            .eq('token_id', vault.id);
          docCount = count || 0;
        }

        return {
          ...c,
          vault_token: vault?.token || null,
          document_count: docCount,
        };
      })
    );

    return NextResponse.json({ success: true, cases: casesWithVault });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — update case status or notes (professional can mark as reviewed, approved, needs changes)
export async function PUT(request) {
  const profId = checkAuth(request);
  if (!profId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing assignment id' }, { status: 400 });

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'approved' || status === 'completed') updateData.reviewed_at = new Date().toISOString();
    }
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('professional_assignments')
      .update(updateData)
      .eq('id', id)
      .eq('professional_id', profId) // ensure they can only update their own
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, assignment: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
