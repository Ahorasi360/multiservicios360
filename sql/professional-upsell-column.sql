-- Add professional_upsell column to simple_doc_matters
ALTER TABLE simple_doc_matters 
ADD COLUMN IF NOT EXISTS professional_upsell BOOLEAN DEFAULT FALSE;

-- Add notary_upsell column for future notary coordination tracking  
ALTER TABLE simple_doc_matters 
ADD COLUMN IF NOT EXISTS notary_upsell BOOLEAN DEFAULT FALSE;

-- Index for fast admin queries on coordination requests
CREATE INDEX IF NOT EXISTS idx_simple_doc_professional_upsell 
ON simple_doc_matters(professional_upsell) 
WHERE professional_upsell = TRUE;

-- View: pending coordination requests (paid + requested professional)
-- Usage: SELECT * FROM coordination_requests_pending ORDER BY paid_at DESC;
CREATE OR REPLACE VIEW coordination_requests_pending AS
SELECT 
  id,
  document_type,
  client_name,
  client_email,
  client_phone,
  language,
  professional_upsell,
  notary_upsell,
  status,
  partner_code,
  created_at,
  updated_at
FROM simple_doc_matters
WHERE professional_upsell = TRUE
  AND status = 'paid'
ORDER BY created_at DESC;
