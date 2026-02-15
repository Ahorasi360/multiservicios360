-- Run this in Supabase SQL Editor
-- Adds login capability + case assignments for professionals

-- 1. Add password to professionals table
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Case assignments — links a professional to matters
CREATE TABLE IF NOT EXISTS professional_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  matter_type TEXT NOT NULL, -- 'general_poa', 'limited_poa', 'living_trust', 'llc_formation'
  matter_id UUID NOT NULL,
  client_name TEXT,
  client_email TEXT,
  service_label TEXT, -- e.g. 'General POA - Standard'
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'needs_changes', 'completed')),
  notes TEXT,
  reviewed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prof_assignments_prof ON professional_assignments(professional_id);
CREATE INDEX IF NOT EXISTS idx_prof_assignments_status ON professional_assignments(status);
CREATE INDEX IF NOT EXISTS idx_prof_assignments_matter ON professional_assignments(matter_type, matter_id);

-- Auto-update timestamp
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_prof_assignments_ts') THEN
    CREATE TRIGGER update_prof_assignments_ts BEFORE UPDATE ON professional_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END;
$$;
