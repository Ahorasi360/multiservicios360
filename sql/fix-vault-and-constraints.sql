-- ============================================================
-- MIGRATION: Fix vault_tokens + simple_doc_matters
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add missing columns to vault_tokens
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS client_email TEXT;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS drip_sent JSONB DEFAULT '{}';

-- 2. Add simple_doc_matters document type constraint (drop old, add new)
ALTER TABLE simple_doc_matters
DROP CONSTRAINT IF EXISTS simple_doc_matters_document_type_check;

ALTER TABLE simple_doc_matters
ADD CONSTRAINT simple_doc_matters_document_type_check
CHECK (document_type IN (
  'bill_of_sale',
  'affidavit',
  'revocation_poa',
  'authorization_letter',
  'promissory_note',
  'guardianship_designation',
  'travel_authorization',
  'pour_over_will',
  'simple_will',
  'hipaa_authorization',
  'certification_of_trust',
  's_corp_formation',
  'c_corp_formation',
  'corporate_minutes',
  'banking_resolution'
));

-- 3. Index for vault renewal cron (queries by email)
CREATE INDEX IF NOT EXISTS idx_vault_tokens_email ON vault_tokens(client_email);
CREATE INDEX IF NOT EXISTS idx_vault_tokens_expires ON vault_tokens(expires_at);
