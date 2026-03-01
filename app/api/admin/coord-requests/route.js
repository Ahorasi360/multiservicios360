export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function checkAuth(request) {
  const pw = request.headers.get('x-admin-password');
  return pw === 'MS360Admin2026!' || pw === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch paid simple_doc_matters with professional_upsell = true
    const { data: simpleRequests, error: simpleErr } = await supabase
      .from('simple_doc_matters')
      .select('id, document_type, client_name, client_email, client_phone, language, status, created_at, professional_upsell, partner_code')
      .eq('professional_upsell', true)
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    if (simpleErr) throw simpleErr;

    // Also fetch POA matters with attorney coordination tier
    const { data: poaRequests, error: poaErr } = await supabase
      .from('poa_matters')
      .select('id, principal_name, principal_email, principal_phone, language, status, created_at, review_tier')
      .in('review_tier', ['attorney_review', 'attorney_consult'])
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    // Trust matters with attorney tier
    const { data: trustRequests, error: trustErr } = await supabase
      .from('trust_matters')
      .select('id, grantor_name, grantor_email, grantor_phone, language, status, created_at, review_tier')
      .in('review_tier', ['attorney'])
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    const requests = [
      ...(simpleRequests || []).map(r => ({
        id: r.id,
        source: 'simple_doc',
        document_type: r.document_type,
        client_name: r.client_name,
        client_email: r.client_email,
        client_phone: r.client_phone,
        language: r.language,
        status: r.status,
        created_at: r.created_at,
        professional_upsell: r.professional_upsell,
        assigned_professional: null, // can be extended later
      })),
      ...(poaRequests || []).map(r => ({
        id: r.id,
        source: 'poa',
        document_type: 'general_poa',
        client_name: r.principal_name,
        client_email: r.principal_email,
        client_phone: r.principal_phone,
        language: r.language,
        status: r.status,
        created_at: r.created_at,
        professional_upsell: true,
        review_tier: r.review_tier,
        assigned_professional: null,
      })),
      ...(trustRequests || []).map(r => ({
        id: r.id,
        source: 'trust',
        document_type: 'living_trust',
        client_name: r.grantor_name,
        client_email: r.grantor_email,
        client_phone: r.grantor_phone,
        language: r.language,
        status: r.status,
        created_at: r.created_at,
        professional_upsell: true,
        review_tier: r.review_tier,
        assigned_professional: null,
      })),
    ];

    // Sort all by created_at
    requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Coord requests error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
