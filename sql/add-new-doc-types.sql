-- Migration: Add new document types to simple_doc_matters constraint
-- Run this in Supabase SQL Editor

-- Step 1: Drop the old check constraint
ALTER TABLE simple_doc_matters 
DROP CONSTRAINT IF EXISTS simple_doc_matters_document_type_check;

-- Step 2: Add updated constraint with all document types
ALTER TABLE simple_doc_matters 
ADD CONSTRAINT simple_doc_matters_document_type_check 
CHECK (document_type IN (
  -- Original docs
  'bill_of_sale', 
  'affidavit', 
  'revocation_poa', 
  'authorization_letter', 
  'promissory_note', 
  'guardianship_designation',
  'travel_authorization',
  -- Estate Planning (new)
  'pour_over_will',
  'simple_will',
  'hipaa_authorization',
  'certification_of_trust',
  -- Corporate (new)
  's_corp_formation',
  'c_corp_formation',
  'corporate_minutes',
  'banking_resolution'
));
