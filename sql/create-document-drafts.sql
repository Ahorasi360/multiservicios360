-- ════════════════════════════════════════════════════════════════
-- document_drafts table — Auto-save for abandonment reminders
-- Run this in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════

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
  -- Reminder tracking
  reminder_1_sent       BOOLEAN DEFAULT false,
  reminder_2_sent       BOOLEAN DEFAULT false,
  reminder_3_sent       BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one draft per email+doc_type (upsert)
  UNIQUE(email, doc_type)
);

-- Indexes for cron job performance
CREATE INDEX IF NOT EXISTS idx_document_drafts_email     ON document_drafts(email);
CREATE INDEX IF NOT EXISTS idx_document_drafts_doc_type  ON document_drafts(doc_type);
CREATE INDEX IF NOT EXISTS idx_document_drafts_completed ON document_drafts(completed);
CREATE INDEX IF NOT EXISTS idx_document_drafts_created   ON document_drafts(created_at);
CREATE INDEX IF NOT EXISTS idx_document_drafts_reminders ON document_drafts(completed, reminder_1_sent, reminder_2_sent, reminder_3_sent);

-- Auto-update updated_at
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

-- RLS: Only service role can access (no public access)
ALTER TABLE document_drafts ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by API routes)
CREATE POLICY "service_role_all" ON document_drafts
  FOR ALL USING (true)
  WITH CHECK (true);
