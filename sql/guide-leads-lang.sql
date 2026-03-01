-- Add language column to guide_leads if not exists
ALTER TABLE guide_leads ADD COLUMN IF NOT EXISTS lang TEXT DEFAULT 'es';

-- Create the table fresh if it doesn't exist yet
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

CREATE INDEX IF NOT EXISTS idx_guide_leads_email ON guide_leads(email);
CREATE INDEX IF NOT EXISTS idx_guide_leads_slug ON guide_leads(guide_slug);
CREATE INDEX IF NOT EXISTS idx_guide_leads_created ON guide_leads(created_at DESC);
