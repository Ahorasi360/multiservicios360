import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const matterId = formData.get('matter_id');
    const clientName = formData.get('client_name');
    const clientEmail = formData.get('client_email');
    const documentType = formData.get('document_type') || 'other';
    const language = formData.get('language') || 'en';
    const fileName = formData.get('file_name') || 'document.pdf';

    if (!file || !matterId) {
      return NextResponse.json({ error: 'file and matter_id required' }, { status: 400 });
    }

    let { data: vaultToken } = await supabase
      .from('vault_tokens')
      .select('id, token')
      .eq('matter_id', matterId)
      .single();

    if (!vaultToken) {
      const token = crypto.randomBytes(32).toString('hex');
      const { data: newToken, error: tokenError } = await supabase
        .from('vault_tokens')
        .insert({
          matter_id: matterId,
          token,
          client_email: clientEmail || null,
          client_name: clientName || null,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (tokenError) {
        console.error('Vault token error:', tokenError);
        return NextResponse.json({ error: 'Failed to create vault' }, { status: 500 });
      }
      vaultToken = newToken;
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storagePath = matterId + '/' + Date.now() + '-' + fileName;

    const { error: uploadError } = await supabase.storage
      .from('vault-files')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage error:', uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { error: docError } = await supabase
      .from('vault_documents')
      .insert({
        matter_id: matterId,
        token_id: vaultToken.id,
        document_type: documentType,
        language,
        file_name: fileName,
        file_url: storagePath,
        file_size: fileBuffer.length,
        source: 'generated',
      });

    if (docError) {
      console.error('Doc entry error:', docError);
      return NextResponse.json({ error: 'Failed to register document' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';

    return NextResponse.json({
      success: true,
      vault_url: baseUrl + '/vault?code=' + vaultToken.token,
      vault_token: vaultToken.token,
    });
  } catch (error) {
    console.error('Vault auto-save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
