export const dynamic = 'force-dynamic';
// app/api/vault/[token]/download/[docId]/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/vault/[token]/download/[docId]
 * Validates token ownership, then serves the PDF file.
 * Documents are served through this authenticated route, not direct storage URLs.
 */
export async function GET(request, { params }) {
  try {
    const { token, docId } = params;

    if (!token || !docId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Validate token
    const { data: vaultToken, error: tokenError } = await supabase
      .from('vault_tokens')
      .select('id, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !vaultToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
    }

    // Check expiration
    if (new Date(vaultToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 410 });
    }

    // Validate document belongs to this token
    const { data: doc, error: docError } = await supabase
      .from('vault_documents')
      .select('*')
      .eq('id', docId)
      .eq('token_id', vaultToken.id)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Fetch file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('vault-files')
      .download(doc.file_url);

    if (downloadError || !fileData) {
      console.error('Storage download error:', downloadError);
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Determine content type
    const fileName = doc.file_name || 'document.pdf';
    const ext = fileName.split('.').pop().toLowerCase();
    const contentTypes = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Vault download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
