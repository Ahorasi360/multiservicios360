export const dynamic = 'force-dynamic';
// app/api/portal/clients/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');
    if (!partnerId) return NextResponse.json({ success: false, error: 'Partner ID required' }, { status: 400 });

    // Get registered clients
    const { data: registeredClients } = await supabase
      .from('partner_clients')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    // Also pull unique clients from all matter tables
    const tables = ['poa_matters','limited_poa_matters','trust_matters','llc_matters','simple_doc_matters'];
    const matterClientMap = {};

    for (const table of tables) {
      const { data } = await supabase
        .from(table)
        .select('client_name, client_email, client_phone, created_at')
        .eq('partner_id', partnerId);
      if (data) {
        data.forEach(m => {
          if (m.client_email && !matterClientMap[m.client_email]) {
            matterClientMap[m.client_email] = {
              id: `matter-${m.client_email}`,
              partner_id: partnerId,
              client_name: m.client_name,
              client_email: m.client_email,
              client_phone: m.client_phone || null,
              language_preference: 'es',
              created_at: m.created_at,
              from_matter: true,
            };
          }
        });
      }
    }

    // Merge: registered clients take priority, add matter clients not already registered
    const registeredEmails = new Set((registeredClients || []).map(c => c.client_email));
    const matterClients = Object.values(matterClientMap).filter(c => !registeredEmails.has(c.client_email));

    const allClients = [...(registeredClients || []), ...matterClients];
    allClients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({ success: true, clients: allClients });
  } catch (error) {
    console.error('Clients GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { partner_id, client_name, client_email, client_phone, language_preference } = body;

    if (!partner_id) return NextResponse.json({ success: false, error: 'Partner ID required' }, { status: 400 });
    if (!client_name || client_name.trim() === '') return NextResponse.json({ success: false, error: 'Client name required' }, { status: 400 });

    const { data, error } = await supabase
      .from('partner_clients')
      .insert({
        partner_id,
        client_name: client_name.trim(),
        client_email: client_email?.trim().toLowerCase() || null,
        client_phone: client_phone?.trim() || null,
        language_preference: language_preference || 'es',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, client: data });
  } catch (error) {
    console.error('Clients POST error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
