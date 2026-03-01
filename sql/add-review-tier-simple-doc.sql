-- Add review_tier column to simple_doc_matters
-- Mirrors the review_tier column in poa_matters, trust_matters, llc_matters

ALTER TABLE simple_doc_matters 
  ADD COLUMN IF NOT EXISTS review_tier TEXT DEFAULT 'draft_only';

-- Update existing records that have professional_upsell in form_data
UPDATE simple_doc_matters 
SET review_tier = 'attorney_review_silent'
WHERE form_data->>'professional_upsell' = 'true'
  AND review_tier IS NULL;

-- Add index for admin queries
CREATE INDEX IF NOT EXISTS idx_simple_doc_review_tier 
  ON simple_doc_matters(review_tier) 
  WHERE review_tier != 'draft_only';
