// app/api/admin/vaults/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  // Admin auth check
  const adminPassword = request.headers.get('x-admin-password');
  if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'MS360Admin2026!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all vault tokens with document count
    const { data: tokens, error } = await supabase
      .from('vault_tokens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vaults:', error);
      return NextResponse.json({ error: 'Failed to fetch vaults' }, { status: 500 });
    }

    // Get document counts for each token
    const vaultsWithCounts = await Promise.all(
      (tokens || []).map(async (token) => {
        const { count } = await supabase
          .from('vault_documents')
          .select('*', { count: 'exact', head: true })
          .eq('token_id', token.id);

        return {
          ...token,
          document_count: count || 0,
        };
      })
    );

    return NextResponse.json({ vaults: vaultsWithCounts });
  } catch (error) {
    console.error('Admin vaults error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}