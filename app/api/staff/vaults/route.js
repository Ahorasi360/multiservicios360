// app/api/staff/vaults/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendVaultEmail } from '../../../../lib/send-vault-email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function checkStaffAuth(request) {
  const staffId = request.headers.get('x-staff-id');
  return staffId && staffId.length > 10;
}

// GET — all vaults
export async function GET(request) {
  if (!checkStaffAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data: tokens, error } = await supabase
      .from('vault_tokens')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const vaultsWithCounts = await Promise.all(
      (tokens || []).map(async (token) => {
        const { count } = await supabase
          .from('vault_documents')
          .select('*', { count: 'exact', head: true })
          .eq('token_id', token.id);
        return { ...token, document_count: count || 0 };
      })
    );

    return NextResponse.json({ success: true, vaults: vaultsWithCounts });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — resend vault email
export async function POST(request) {
  if (!checkStaffAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { action, token_id } = await request.json();

    if (action === 'resend_email') {
      const { data: vault, error } = await supabase
        .from('vault_tokens')
        .select('*')
        .eq('id', token_id)
        .single();
      if (error || !vault) return NextResponse.json({ error: 'Vault not found' }, { status: 404 });

      const vaultUrl = `https://multiservicios360.net/vault?code=${vault.token}`;
      const result = await sendVaultEmail(vault.client_email, vault.client_name, vaultUrl, vault.service_type || 'general_poa');

      if (result.success) {
        return NextResponse.json({ success: true, message: 'Email sent' });
      } else {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
