// lib/vault.js
// Utility functions for vault operations — call from document generators or webhook

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Create a vault for a matter after documents are generated.
 * If a vault already exists for the matter, adds documents to it.
 *
 * @param {Object} params
 * @param {string} params.matter_id - UUID of the matter
 * @param {string} params.client_email - Client's email
 * @param {string} params.client_name - Client's name
 * @param {Array} params.documents - Array of { document_type, language, file_name, file_url, file_size }
 * @returns {Object} { token, vault_url }
 */
export async function createVault({ matter_id, client_email, client_name, documents }) {
  // Check for existing vault token
  let { data: existing } = await supabase
    .from('vault_tokens')
    .select('id, token')
    .eq('matter_id', matter_id)
    .single();

  let tokenRecord;

  if (existing) {
    tokenRecord = existing;
  } else {
    const token = crypto.randomBytes(32).toString('hex');

    const { data: newToken, error } = await supabase
      .from('vault_tokens')
      .insert({
        matter_id,
        token,
        client_email,
        client_name,
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create vault token: ${error.message}`);
    tokenRecord = newToken;
  }

  // Insert documents
  if (documents && documents.length > 0) {
    const docEntries = documents.map((doc) => ({
      matter_id,
      token_id: tokenRecord.id,
      document_type: doc.document_type,
      language: doc.language || 'en',
      file_name: doc.file_name,
      file_url: doc.file_url,
      file_size: doc.file_size || null,
      source: doc.source || 'generated',
    }));

    const { error } = await supabase.from('vault_documents').insert(docEntries);
    if (error) throw new Error(`Failed to insert vault documents: ${error.message}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';
  return {
    token: tokenRecord.token,
    vault_url: `${baseUrl}/vault?code=${tokenRecord.token}`,
    token_id: tokenRecord.id,
  };
}

/**
 * Upload a file to vault storage and register it.
 *
 * @param {Object} params
 * @param {string} params.matter_id
 * @param {string} params.token_id - Vault token UUID
 * @param {Buffer} params.fileBuffer
 * @param {string} params.fileName
 * @param {string} params.document_type
 * @param {string} params.language - 'en' or 'es'
 * @param {string} params.contentType - MIME type
 * @param {string} params.source - 'generated' or 'uploaded'
 */
export async function uploadToVault({
  matter_id,
  token_id,
  fileBuffer,
  fileName,
  document_type,
  language = 'en',
  contentType = 'application/pdf',
  source = 'generated',
}) {
  const storagePath = `${matter_id}/${Date.now()}-${fileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase
    .storage
    .from('vault-files')
    .upload(storagePath, fileBuffer, { contentType, upsert: false });

  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

  // Register document
  const { data: doc, error: docError } = await supabase
    .from('vault_documents')
    .insert({
      matter_id,
      token_id,
      document_type,
      language,
      file_name: fileName,
      file_url: storagePath,
      file_size: fileBuffer.length,
      source,
    })
    .select()
    .single();

  if (docError) throw new Error(`Document registration failed: ${docError.message}`);

  return doc;
}
