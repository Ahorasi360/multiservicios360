// app/api/portal/documents/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SERVICE_LABELS = {
  general_poa: 'General POA',
  limited_poa: 'Limited POA',
  living_trust: 'Living Trust',
  llc_formation: 'LLC Formation',
  authorization_letter: 'Travel Authorization',
  bill_of_sale: 'Bill of Sale',
  affidavit: 'Affidavit',
  promissory_note: 'Promissory Note',
  guardianship_designation: 'Guardianship Designation',
  revocation_poa: 'POA Revocation',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');

    if (!partnerId) {
      return NextResponse.json({ success: false, error: 'Partner ID is required' }, { status: 400 });
    }

    let allDocs = [];

    // Query all matter tables directly by partner_id
    const tables = [
      { name: 'poa_matters', type: 'general_poa' },
      { name: 'limited_poa_matters', type: 'limited_poa' },
      { name: 'trust_matters', type: 'living_trust' },
      { name: 'llc_matters', type: 'llc_formation' },
      { name: 'simple_doc_matters', type: 'simple_doc' },
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table.name)
        .select('id, client_name, client_email, status, total_price, created_at, document_type')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        allDocs.push(...data.map(m => ({
          id: m.id,
          document_id: m.id,
          document_type: m.document_type || table.type,
          service_type: m.document_type || table.type,
          service_label: SERVICE_LABELS[m.document_type || table.type] || table.type,
          client_name: m.client_name || '—',
          client_email: m.client_email || null,
          status: m.status || 'pending',
          total_price: m.total_price || 0,
          created_at: m.created_at,
        })));
      }
    }

    // Also pull from partner_referrals for commission data
    const { data: referrals } = await supabase
      .from('partner_referrals')
      .select('document_id, commission_amount, status')
      .eq('partner_id', partnerId);

    const referralMap = {};
    (referrals || []).forEach(r => { referralMap[r.document_id] = r; });

    // Merge commission data
    allDocs = allDocs.map(doc => ({
      ...doc,
      commission_amount: referralMap[doc.id]?.commission_amount || null,
      commission_status: referralMap[doc.id]?.status || null,
    }));

    // Sort by newest first
    allDocs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({ success: true, documents: allDocs });

  } catch (error) {
    console.error('Documents GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
