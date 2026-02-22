// app/api/portal/earnings/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SERVICE_LABELS = {
  general_poa: 'General POA', limited_poa: 'Limited POA', living_trust: 'Living Trust',
  llc_formation: 'LLC Formation', authorization_letter: 'Travel Authorization',
  bill_of_sale: 'Bill of Sale', affidavit: 'Affidavit', promissory_note: 'Promissory Note',
  guardianship_designation: 'Guardianship', revocation_poa: 'POA Revocation', simple_doc: 'Document',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');
    if (!partnerId) return NextResponse.json({ success: false, error: 'Partner ID is required' }, { status: 400 });

    const { data: partner } = await supabase.from('partners').select('commission_rate').eq('id', partnerId).single();
    const commissionRate = (partner?.commission_rate || 20) / 100;

    // Get commissions from partner_referrals
    const { data: referrals } = await supabase
      .from('partner_referrals')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    // Get all documents from matter tables for earnings calculation
    const tables = [
      { name: 'poa_matters', type: 'general_poa' },
      { name: 'limited_poa_matters', type: 'limited_poa' },
      { name: 'trust_matters', type: 'living_trust' },
      { name: 'llc_matters', type: 'llc_formation' },
      { name: 'simple_doc_matters', type: 'simple_doc' },
    ];

    let allMatters = [];
    for (const table of tables) {
      const { data } = await supabase
        .from(table.name)
        .select('id, client_name, client_email, total_price, status, created_at, document_type')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });
      if (data) {
        allMatters.push(...data.map(m => ({
          ...m,
          service_type: m.document_type || table.type,
          service_label: SERVICE_LABELS[m.document_type || table.type] || 'Document',
        })));
      }
    }

    // Build referral map by document_id for commission data
    const referralMap = {};
    (referrals || []).forEach(r => { referralMap[r.document_id] = r; });

    // Merge: use referral commission if available, else calculate
    const earnings = allMatters.map(m => {
      const ref = referralMap[m.id];
      const paidAmt = (m.status === 'paid' || m.status === 'completed') ? (parseFloat(m.total_price) || 0) : 0;
      const commissionAmt = ref ? parseFloat(ref.commission_amount) : paidAmt * commissionRate;
      const commissionStatus = ref ? ref.status : (paidAmt > 0 ? 'pending' : null);
      return {
        id: m.id,
        client_name: m.client_name || '—',
        client_email: m.client_email || null,
        service_label: m.service_label,
        status: m.status,
        total_price: m.total_price || 0,
        commission_amount: commissionAmt,
        commission_status: commissionStatus,
        created_at: m.created_at,
      };
    }).filter(e => e.commission_amount > 0 || e.status === 'paid');

    const totalEarnings = earnings.reduce((s, e) => s + (e.commission_amount || 0), 0);
    const pendingPayout = earnings.filter(e => e.commission_status === 'pending').reduce((s, e) => s + (e.commission_amount || 0), 0);
    const totalPaid = earnings.filter(e => e.commission_status === 'paid').reduce((s, e) => s + (e.commission_amount || 0), 0);

    return NextResponse.json({ success: true, earnings, totalEarnings, pendingPayout, totalPaid });

  } catch (error) {
    console.error('Earnings error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
