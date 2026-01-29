// app/api/portal/documents/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    // Get all referrals for this partner (these link to documents)
    const { data: referrals, error: referralsError } = await supabase
      .from('partner_referrals')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (referralsError) {
      console.error('Fetch referrals error:', referralsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    // Get client names for each referral
    const clientIds = [...new Set(referrals?.map(r => r.client_id).filter(Boolean))];
    
    let clientsMap = {};
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from('partner_clients')
        .select('id, client_name, client_email')
        .in('id', clientIds);
      
      clients?.forEach(c => {
        clientsMap[c.id] = c;
      });
    }

    // Fetch actual document details from poa_matters and limited_poa_matters
    const documents = await Promise.all(
      (referrals || []).map(async (referral) => {
        let docDetails = null;

        // Try to get document details based on type
        if (referral.document_type === 'general_poa' && referral.document_id) {
          const { data } = await supabase
            .from('poa_matters')
            .select('id, client_name, client_email, status, total_price, review_tier, created_at')
            .eq('id', referral.document_id)
            .single();
          docDetails = data;
        } else if (referral.document_type === 'limited_poa' && referral.document_id) {
          const { data } = await supabase
            .from('limited_poa_matters')
            .select('id, client_name, client_email, status, total_price, review_tier, category, created_at')
            .eq('id', referral.document_id)
            .single();
          docDetails = data;
        }

        // Get client info
        const client = clientsMap[referral.client_id] || {};

        return {
          id: referral.id,
          document_id: referral.document_id,
          document_type: referral.document_type,
          client_id: referral.client_id,
          client_name: docDetails?.client_name || client.client_name || 'Unknown',
          client_email: docDetails?.client_email || client.client_email || null,
          status: docDetails?.status || 'pending_payment',
          total_price: docDetails?.total_price || referral.sale_amount || 0,
          review_tier: docDetails?.review_tier || null,
          category: docDetails?.category || null,
          commission_amount: referral.commission_amount,
          commission_status: referral.status,
          created_at: referral.created_at
        };
      })
    );

    return NextResponse.json({
      success: true,
      documents
    });

  } catch (error) {
    console.error('Documents GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}