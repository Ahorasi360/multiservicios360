export const dynamic = 'force-dynamic';
// app/api/staff/matters/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function checkStaffAuth(request) {
  const staffId = request.headers.get('x-staff-id');
  return staffId && staffId.length > 10;
}

const TABLE_MAP = {
  general_poa: 'poa_matters',
  limited_poa: 'limited_poa_matters',
  living_trust: 'trust_matters',
  llc_formation: 'llc_matters',
  simple_doc: 'simple_doc_matters',
};

// GET — all matters across all services
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

    if (search) {
      const s = search.toLowerCase();
      allMatters = allMatters.filter(m =>
        (m.client_name || '').toLowerCase().includes(s) ||
        (m.client_email || '').toLowerCase().includes(s)
      );
    }

    allMatters.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return NextResponse.json({ success: true, matters: allMatters.slice(0, 200) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — edit a matter's client info and intake data
export async function PATCH(request) {
  if (!checkStaffAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { matter_id, service_type, client_name, client_email, client_phone, intake_data, staff_note } = body;

    if (!matter_id || !service_type) return NextResponse.json({ error: 'Missing matter_id or service_type' }, { status: 400 });

    const table = TABLE_MAP[service_type];
    if (!table) return NextResponse.json({ error: 'Unknown service_type' }, { status: 400 });

    const updates = {};
    if (client_name) updates.client_name = client_name;
    if (client_email) updates.client_email = client_email;
    if (client_phone !== undefined) updates.client_phone = client_phone;
    if (intake_data) updates.intake_data = intake_data;
    if (staff_note !== undefined) updates.staff_note = staff_note;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from(table).update(updates).eq('id', matter_id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, matter: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
