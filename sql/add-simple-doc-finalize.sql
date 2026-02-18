-- Add finalize columns to simple_doc_matters
-- Run this in Supabase SQL Editor

ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS execution_date TEXT;
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS electronic_signature TEXT;
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS signed_at_utc TIMESTAMPTZ;
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS signed_at_local TEXT;
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS document_version_id TEXT;
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS finalized_at TIMESTAMPTZ;
