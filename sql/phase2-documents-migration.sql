-- ════════════════════════════════════════════════════════════════
-- PHASE 2 DOCUMENTS MIGRATION
-- Run this in Supabase SQL Editor
-- Adds: small_estate_affidavit, quitclaim_deed, contractor_agreement,
--       demand_letter, apostille_letter
-- Also ensures: document_drafts, guide_leads tables exist
-- ════════════════════════════════════════════════════════════════

-- ─── 1. Update simple_doc_matters constraint ───────────────────
ALTER TABLE simple_doc_matters 
DROP CONSTRAINT IF EXISTS simple_doc_matters_document_type_check;

ALTER TABLE simple_doc_matters 
ADD CONSTRAINT simple_doc_matters_document_type_check 
CHECK (document_type IN (
  -- Original docs
  'bill_of_sale', 'affidavit', 'revocation_poa', 'authorization_letter',
  'promissory_note', 'guardianship_designation', 'travel_authorization',
  -- Estate Planning
  'pour_over_will', 'simple_will', 'hipaa_authorization', 'certification_of_trust',
  -- Corporate
  's_corp_formation', 'c_corp_formation', 'corporate_minutes', 'banking_resolution',
  -- Phase 2 — NEW
  'small_estate_affidavit', 'quitclaim_deed', 'contractor_agreement',
  'demand_letter', 'apostille_letter'
));

-- ─── 2. Ensure document_drafts table exists ────────────────────
CREATE TABLE IF NOT EXISTS document_drafts (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email                 TEXT NOT NULL,
  doc_type              TEXT NOT NULL,
  language              TEXT NOT NULL DEFAULT 'es',
  client_name           TEXT,
  intake_data           JSONB DEFAULT '{}',
  current_question_index INTEGER DEFAULT 0,
  messages              JSONB DEFAULT '[]',
  step                  TEXT DEFAULT 'intake',
  partner_code          TEXT,
  completed             BOOLEAN DEFAULT false,
  reminder_1_sent       BOOLEAN DEFAULT false,
  reminder_2_sent       BOOLEAN DEFAULT false,
  reminder_3_sent       BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, doc_type)
);

CREATE INDEX IF NOT EXISTS idx_document_drafts_email     ON document_drafts(email);
CREATE INDEX IF NOT EXISTS idx_document_drafts_doc_type  ON document_drafts(doc_type);
CREATE INDEX IF NOT EXISTS idx_document_drafts_completed ON document_drafts(completed);
CREATE INDEX IF NOT EXISTS idx_document_drafts_created   ON document_drafts(created_at);
CREATE INDEX IF NOT EXISTS idx_document_drafts_reminders ON document_drafts(completed, reminder_1_sent, reminder_2_sent, reminder_3_sent);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_document_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_document_drafts_updated_at ON document_drafts;
CREATE TRIGGER trg_document_drafts_updated_at
  BEFORE UPDATE ON document_drafts
  FOR EACH ROW EXECUTE FUNCTION update_document_drafts_updated_at();

-- RLS: service role only
ALTER TABLE document_drafts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all" ON document_drafts;
CREATE POLICY "service_role_all" ON document_drafts
  FOR ALL USING (true) WITH CHECK (true);

-- ─── 3. Ensure guide_leads table exists ────────────────────────
CREATE TABLE IF NOT EXISTS guide_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_slug TEXT NOT NULL,
  guide_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  lang TEXT DEFAULT 'es',
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add lang column if table existed without it
ALTER TABLE guide_leads ADD COLUMN IF NOT EXISTS lang TEXT DEFAULT 'es';

CREATE INDEX IF NOT EXISTS idx_guide_leads_email   ON guide_leads(email);
CREATE INDEX IF NOT EXISTS idx_guide_leads_slug    ON guide_leads(guide_slug);
CREATE INDEX IF NOT EXISTS idx_guide_leads_created ON guide_leads(created_at DESC);

-- ─── 4. Add execution_date and electronic_signature to simple_doc_matters ─
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS execution_date TEXT;
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS electronic_signature TEXT;
ALTER TABLE simple_doc_matters ADD COLUMN IF NOT EXISTS signature_accepted BOOLEAN DEFAULT false;

-- ─── Done ─────────────────────────────────────────────────────
-- Run this entire script in Supabase SQL Editor.
-- After running, your platform will fully support all Phase 2 documents,
-- draft reminders, and guide lead capture.
