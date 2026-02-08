// app/api/vault/create/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/vault/create
 * Called after Stripe webhook + document generation.
 * Creates a vault_token and vault_documents entries.
 *
 * Body: {
 *   matter_id: UUID,
 *   client_email: string,
 *   client_name: string,
 *   documents: [
 *     { document_type, language, file_name, file_url, file_size }
 *   ]
 * }
 *
 * Returns: { token, vault_url }
 */
export async function POST(request) {
  try {
    // Verify internal call (add your own auth check here)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.VAULT_INTERNAL_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { matter_id, client_email, client_name, documents } = body;

    if (!matter_id || !documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'matter_id and documents are required' },
        { status: 400 }
      );
    }

    // Generate secure 64-char token
    const token = crypto.randomBytes(32).toString('hex');

    // Check if vault token already exists for this matter
    const { data: existing } = await supabase
      .from('vault_tokens')
      .select('id, token')
      .eq('matter_id', matter_id)
      .single();

    let tokenRecord;

    if (existing) {
      // Use existing token, just add documents
      tokenRecord = existing;
    } else {
      // Create new vault token
      const { data: newToken, error: tokenError } = await supabase
        .from('vault_tokens')
        .insert({
          matter_id,
          token,
          client_email: client_email || null,
          client_name: client_name || null,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (tokenError) {
        console.error('Error creating vault token:', tokenError);
        return NextResponse.json({ error: 'Failed to create vault token' }, { status: 500 });
      }
      tokenRecord = newToken;
    }

    // Insert vault documents
    const docEntries = documents.map((doc) => ({
      matter_id,
      token_id: tokenRecord.id,
      document_type: doc.document_type,
      language: doc.language || 'en',
      file_name: doc.file_name,
      file_url: doc.file_url,
      file_size: doc.file_size || null,
      source: 'generated',
    }));

    const { error: docError } = await supabase
      .from('vault_documents')
      .insert(docEntries);

    if (docError) {
      console.error('Error creating vault documents:', docError);
      return NextResponse.json({ error: 'Failed to create vault documents' }, { status: 500 });
    }

    const vaultToken = existing ? existing.token : token;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';
    const vaultUrl = `${baseUrl}/vault?code=${vaultToken}`;

    return NextResponse.json({
      success: true,
      token: vaultToken,
      vault_url: vaultUrl,
      documents_count: documents.length,
    });
  } catch (error) {
    console.error('Vault create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
