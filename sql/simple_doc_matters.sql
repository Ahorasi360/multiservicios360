-- Simple Document Matters table
-- Shared table for: Bill of Sale, Affidavit, Revocation of POA, 
-- Authorization Letter, Promissory Note, Guardianship Designation

CREATE TABLE IF NOT EXISTS simple_doc_matters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'bill_of_sale', 'affidavit', 'revocation_poa', 
    'authorization_letter', 'promissory_note', 'guardianship_designation'
  )),
  
  -- Client info
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  
  -- All form data stored as JSONB (flexible per document type)
  form_data JSONB NOT NULL DEFAULT '{}',
  
  -- Partner tracking
  partner_id UUID REFERENCES partners(id),
  partner_code TEXT,
  
  -- Payment & status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'paid', 'in_review', 'completed', 'cancelled')),
  stripe_session_id TEXT,
  payment_id TEXT,
  total_price DECIMAL(10,2),
  paid_at TIMESTAMPTZ,
  
  -- Vault
  vault_token_id UUID REFERENCES vault_tokens(id),
  
  -- Language
  language TEXT DEFAULT 'es',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_simple_doc_type ON simple_doc_matters(document_type);
CREATE INDEX IF NOT EXISTS idx_simple_doc_status ON simple_doc_matters(status);
CREATE INDEX IF NOT EXISTS idx_simple_doc_email ON simple_doc_matters(client_email);
CREATE INDEX IF NOT EXISTS idx_simple_doc_partner ON simple_doc_matters(partner_id);

-- Vault Premium columns (add to vault_tokens)
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS premium_type TEXT CHECK (premium_type IN ('monthly', 'annual', 'lifetime'));
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS premium_stripe_subscription_id TEXT;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS reminder_30_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS reminder_60_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS reminder_85_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS reminder_87_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS reminder_88_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE vault_tokens ADD COLUMN IF NOT EXISTS reminder_89_sent BOOLEAN DEFAULT FALSE;
