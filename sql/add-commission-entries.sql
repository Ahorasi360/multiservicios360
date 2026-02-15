-- Run this in Supabase SQL Editor
-- Creates the transaction-level commission tracking table

CREATE TABLE IF NOT EXISTS sales_commission_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_commission_id UUID REFERENCES sales_commissions(id) ON DELETE CASCADE,
  sales_rep_id UUID REFERENCES sales_reps(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  matter_type TEXT NOT NULL,
  matter_id UUID NOT NULL,
  document_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commission_entries_rep ON sales_commission_entries(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_commission_entries_commission ON sales_commission_entries(sales_commission_id);
