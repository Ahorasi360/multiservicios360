export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(request) {
  try {
    // Check for password in header
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch General POA matters
    const { data: poaMatters, error: poaError } = await supabase
      .from('poa_matters')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch Limited POA matters
    const { data: limitedPoaMatters, error: limitedError } = await supabase
      .from('limited_poa_matters')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch Trust matters
    const { data: trustMatters, error: trustError } = await supabase
      .from('trust_matters')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch LLC matters
    const { data: llcMatters, error: llcError } = await supabase
      .from('llc_matters')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch Simple Doc matters
    const { data: simpleDocMatters, error: simpleDocError } = await supabase
      .from('simple_doc_matters')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch Waitlist
    const { data: waitlist, error: waitlistError } = await supabase
      .from('waitlist_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (poaError || limitedError || waitlistError) {
      console.error('Errors:', { poaError, limitedError, waitlistError, trustError, llcError, simpleDocError });
    }

    // Calculate stats
    const poa = poaMatters || [];
    const limited = limitedPoaMatters || [];
    const trust = trustMatters || [];
    const llc = llcMatters || [];
    const simpleDocs = simpleDocMatters || [];
    const wait = waitlist || [];

    const poaPaid = poa.filter(m => m.status === 'paid' || m.status === 'completed');
    const limitedPaid = limited.filter(m => m.status === 'paid' || m.status === 'completed');
    const trustPaid = trust.filter(m => m.status === 'paid' || m.status === 'completed');
    const llcPaid = llc.filter(m => m.status === 'paid' || m.status === 'completed');
    const simpleDocPaid = simpleDocs.filter(m => m.status === 'paid' || m.status === 'completed');

    const totalOrders = poaPaid.length + limitedPaid.length + trustPaid.length + llcPaid.length + simpleDocPaid.length;
    const totalRevenue = poaPaid.reduce((sum, m) => sum + (m.total_price || 0), 0) +
                         limitedPaid.reduce((sum, m) => sum + (m.total_price || 0), 0) +
                         trustPaid.reduce((sum, m) => sum + (m.total_price || 0), 0) +
                         llcPaid.reduce((sum, m) => sum + (m.total_price || 0), 0) +
                         simpleDocPaid.reduce((sum, m) => sum + (m.total_price || 0), 0);
    const pendingOrders = poa.filter(m => m.status === 'pending_payment').length +
                          limited.filter(m => m.status === 'draft' || m.status === 'pending_payment').length +
                          trust.filter(m => m.status === 'draft' || m.status === 'pending_payment').length +
                          llc.filter(m => m.status === 'draft' || m.status === 'pending_payment').length +
                          simpleDocs.filter(m => m.status === 'draft').length;

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        waitlistCount: wait.length,
      },
      poaMatters: poa,
      limitedPoaMatters: limited,
      trustMatters: trust,
      llcMatters: llc,
      simpleDocMatters: simpleDocs,
      waitlist: wait,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}