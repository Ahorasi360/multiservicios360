// app/api/staff/matters/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function checkStaffAuth(request) {
  const staffId = request.headers.get('x-staff-id');
  return staffId && staffId.length > 10;
}

// GET — all matters across all 4 services
export async function GET(request) {
  if (!checkStaffAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const service = url.searchParams.get('service') || '';

    const tables = [
      { name: 'poa_matters', type: 'general_poa' },
      { name: 'limited_poa_matters', type: 'limited_poa' },
      { name: 'trust_matters', type: 'living_trust' },
      { name: 'llc_matters', type: 'llc_formation' },
      { name: 'simple_doc_matters', type: 'simple_doc' },
    ];

    // Only query requested service or all
    const toQuery = service ? tables.filter(t => t.type === service) : tables;

    let allMatters = [];

    for (const table of toQuery) {
      let query = supabase.from(table.name).select('*').order('created_at', { ascending: false }).limit(200);
      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (!error && data) {
        allMatters.push(...data.map(m => ({
          ...m,
          service_type: table.type,
          client_name: m.client_name || m.grantor_name || m.principal_name || '—',
          client_email: m.client_email || m.grantor_email || m.principal_email || '—',
        })));
      }
    }

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      allMatters = allMatters.filter(m =>
        (m.client_name || '').toLowerCase().includes(s) ||
        (m.client_email || '').toLowerCase().includes(s)
      );
    }

    // Sort by date descending
    allMatters.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({ success: true, matters: allMatters.slice(0, 200) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
