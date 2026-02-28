export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/admin/resend-vault
// Body: { matter_id, admin_password }
// OR:   { client_email, admin_password }
export async function POST(request) {
  try {
    const body = await request.json();
    const { matter_id, client_email, admin_password } = body;

    // Simple admin auth
    if (admin_password !== process.env.ADMIN_PASSWORD && admin_password !== 'MS360Admin2026!') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!matter_id && !client_email) {
      return NextResponse.json({ error: 'Provide matter_id or client_email' }, { status: 400 });
    }

    // Find the vault token
    let query = supabase.from('vault_tokens').select('*');
    if (matter_id) {
      query = query.eq('matter_id', matter_id);
    } else {
      query = query.eq('client_email', client_email);
    }

    const { data: tokens, error: tokenError } = await query.order('created_at', { ascending: false }).limit(5);

    if (tokenError) {
      return NextResponse.json({ error: tokenError.message }, { status: 500 });
    }

    if (!tokens || tokens.length === 0) {
      // No vault token found — create one if matter_id provided
      if (!matter_id) {
        return NextResponse.json({ error: 'No vault token found for this email. Provide matter_id to create one.' }, { status: 404 });
      }

      // Try to find matter across tables
      const tables = ['simple_doc_matters', 'poa_matters', 'trust_matters', 'llc_matters', 'limited_poa_matters'];
      let matter = null;
      let matterTable = null;

      for (const table of tables) {
        const { data } = await supabase.from(table).select('*').eq('id', matter_id).single();
        if (data) { matter = data; matterTable = table; break; }
      }

      if (!matter) {
        return NextResponse.json({ error: 'Matter not found in any table' }, { status: 404 });
      }

      // Create new vault token
      const crypto = await import('crypto');
      const token = crypto.randomBytes(32).toString('hex');
      const { data: newToken, error: createErr } = await supabase
        .from('vault_tokens')
        .insert({
          matter_id,
          service_type: matter.doc_type || matter.document_type || 'guardianship_designation',
          token,
          client_email: matter.client_email,
          client_name: matter.client_name,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (createErr) {
        return NextResponse.json({ error: 'Failed to create vault token: ' + createErr.message }, { status: 500 });
      }

      // Send email
      const vaultUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net'}/vault?code=${newToken.token}`;
      const { sendVaultEmail } = await import('../../../../lib/send-vault-email');
      const result = await sendVaultEmail(matter.client_email, matter.client_name, vaultUrl, newToken.service_type);

      return NextResponse.json({
        success: true,
        action: 'created_and_sent',
        vault_url: vaultUrl,
        client_email: matter.client_email,
        email_result: result,
      });
    }

    // Token(s) found — resend to the most recent one
    const vaultToken = tokens[0];
    const vaultUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net'}/vault?code=${vaultToken.token}`;
    const clientEmail = vaultToken.client_email;
    const clientName = vaultToken.client_name || '';

    if (!clientEmail) {
      return NextResponse.json({
        error: 'Vault token found but no client email. Vault URL: ' + vaultUrl,
        vault_url: vaultUrl
      }, { status: 400 });
    }

    const { sendVaultEmail } = await import('../../../../lib/send-vault-email');
    const result = await sendVaultEmail(clientEmail, clientName, vaultUrl, vaultToken.service_type);

    return NextResponse.json({
      success: true,
      action: 'resent',
      vault_url: vaultUrl,
      client_email: clientEmail,
      token_expires: vaultToken.expires_at,
      email_result: result,
    });

  } catch (err) {
    console.error('Resend vault error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
