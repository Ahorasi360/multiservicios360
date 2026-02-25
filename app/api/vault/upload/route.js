export const dynamic = 'force-dynamic';
// app/api/vault/upload/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * POST /api/vault/upload
 * Admin-authenticated endpoint for manually uploading documents to a client vault.
 * Supports both linking to existing matter OR creating a standalone vault.
 */
export async function POST(request) {
  try {
    // Admin auth check — Bearer token
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_API_KEY || 'ms360-admin-key-2026';

    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const matterId = formData.get('matter_id') || null;
    const clientName = formData.get('client_name') || '';
    const clientEmail = formData.get('client_email') || '';
    const documentType = formData.get('document_type') || 'other';
    const language = formData.get('language') || 'en';
    const fileNameOverride = formData.get('file_name');

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Validate document type
    const validTypes = [
      'articles_of_org', 'ein_letter', 'sos_filing',
      'amendment', 'certificate', 'other',
      'poa_general', 'poa_limited', 'living_trust', 'operating_agreement',
    ];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: `Invalid document_type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Find or create vault token
    let vaultToken;

    if (matterId) {
      // Try to find existing vault for this matter
      const { data: existing } = await supabase
        .from('vault_tokens')
        .select('id, token, matter_id')
        .eq('matter_id', matterId)
        .single();

      if (existing) {
        vaultToken = existing;
        // Update client info if provided
        if (clientName || clientEmail) {
          await supabase
            .from('vault_tokens')
            .update({
              ...(clientName && { client_name: clientName }),
              ...(clientEmail && { client_email: clientEmail }),
            })
            .eq('id', existing.id);
        }
      }
    }

    // If no existing vault found, create new one
    if (!vaultToken) {
      const crypto = await import('crypto');
      const token = crypto.randomBytes(32).toString('hex');
      const newMatterId = matterId || crypto.randomUUID();

      const { data: newToken, error: tokenError } = await supabase
        .from('vault_tokens')
        .insert({
          matter_id: newMatterId,
          token,
          client_name: clientName || null,
          client_email: clientEmail || null,
          service_type: documentType,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (tokenError) {
        console.error('Error creating vault token:', tokenError);
        return NextResponse.json({ error: 'Failed to create vault token' }, { status: 500 });
      }
      vaultToken = newToken;
    }

    // Upload file to Supabase storage
    const fileName = fileNameOverride || file.name;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storagePath = `${vaultToken.matter_id || 'uploads'}/${Date.now()}-${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('vault-files')
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Create vault_documents entry
    const { data: vaultDoc, error: docError } = await supabase
      .from('vault_documents')
      .insert({
        matter_id: vaultToken.matter_id || null,
        token_id: vaultToken.id,
        document_type: documentType,
        language,
        file_name: fileName,
        file_url: storagePath,
        file_size: fileBuffer.length,
        source: 'uploaded',
      })
      .select()
      .single();

    if (docError) {
      console.error('Error creating vault document:', docError);
      return NextResponse.json({ error: 'Failed to register document' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';

    return NextResponse.json({
      success: true,
      document_id: vaultDoc.id,
      vault_token: vaultToken.token,
      vault_url: `${baseUrl}/vault?code=${vaultToken.token}`,
      file_name: fileName,
    });
  } catch (error) {
    console.error('Vault upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}