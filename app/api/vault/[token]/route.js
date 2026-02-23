export const dynamic = 'force-dynamic';
// app/api/vault/[token]/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

/**
 * GET /api/vault/[token]
 * Validates token, returns document list.
 * Increments access_count and updates accessed_at.
 */
export async function GET(request, { params }) {
  try {
    const { token } = params;

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!token || token.length < 10) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Look up token
    const { data: vaultToken, error: tokenError } = await supabase
      .from('vault_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !vaultToken) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    // Check expiration
    if (new Date(vaultToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 410 });
    }

    // Update access tracking
    await supabase
      .from('vault_tokens')
      .update({
        accessed_at: new Date().toISOString(),
        access_count: (vaultToken.access_count || 0) + 1,
      })
      .eq('id', vaultToken.id);

    // Fetch documents
    const { data: documents, error: docError } = await supabase
      .from('vault_documents')
      .select('id, document_type, language, file_name, file_size, source, generated_at')
      .eq('token_id', vaultToken.id)
      .order('generated_at', { ascending: false });

    if (docError) {
      console.error('Error fetching vault documents:', docError);
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }

    return NextResponse.json({
      client_name: vaultToken.client_name,
      client_email: vaultToken.client_email,
      expires_at: vaultToken.expires_at,
      access_count: vaultToken.access_count + 1,
      documents: documents || [],
    });
  } catch (error) {
    console.error('Vault lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
