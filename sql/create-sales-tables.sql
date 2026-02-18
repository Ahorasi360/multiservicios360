-- =============================================
-- MULTI SERVICIOS 360 — Sales Team Tables
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Sales Reps table
CREATE TABLE IF NOT EXISTS sales_reps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Commission settings (admin-controlled)
  commission_rate NUMERIC(5,2) DEFAULT 5 CHECK (commission_rate >= 0 AND commission_rate <= 50),
  commission_duration_months INTEGER DEFAULT 1 CHECK (commission_duration_months >= 1 AND commission_duration_months <= 12),
  
  -- Setup fee share (admin-only, hidden from rep)
  setup_fee_share_enabled BOOLEAN DEFAULT false,
  setup_fee_share_percent NUMERIC(5,2) DEFAULT 0 CHECK (setup_fee_share_percent >= 0 AND setup_fee_share_percent <= 100),
  
  -- Tracking
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sales commissions tracking table
-- Links a sales rep to offices they signed up
CREATE TABLE IF NOT EXISTS sales_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_rep_id UUID REFERENCES sales_reps(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  
  -- Commission terms at time of signup (snapshot)
  commission_rate NUMERIC(5,2) NOT NULL,
  duration_months INTEGER NOT NULL,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL,
  
  -- Setup fee share (if enabled at time of signup)
  setup_fee_amount NUMERIC(10,2) DEFAULT 0,
  setup_fee_paid BOOLEAN DEFAULT false,
  
  -- Running totals
  total_document_sales NUMERIC(10,2) DEFAULT 0,
  total_commission_earned NUMERIC(10,2) DEFAULT 0,
  total_commission_paid NUMERIC(10,2) DEFAULT 0,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Individual commission entries per document sale
CREATE TABLE IF NOT EXISTS sales_commission_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_commission_id UUID REFERENCES sales_commissions(id) ON DELETE CASCADE,
  sales_rep_id UUID REFERENCES sales_reps(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id),
  
  -- What was sold
  matter_type TEXT NOT NULL, -- 'general_poa', 'limited_poa', 'living_trust', 'llc_formation'
  matter_id UUID,
  document_price NUMERIC(10,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_reps_status ON sales_reps(status);
CREATE INDEX IF NOT EXISTS idx_sales_reps_email ON sales_reps(email);
CREATE INDEX IF NOT EXISTS idx_sales_commissions_rep ON sales_commissions(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_sales_commissions_partner ON sales_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_sales_commissions_status ON sales_commissions(status);
CREATE INDEX IF NOT EXISTS idx_sales_commission_entries_rep ON sales_commission_entries(sales_rep_id);

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sales_reps_updated_at
  BEFORE UPDATE ON sales_reps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sales_commissions_updated_at
  BEFORE UPDATE ON sales_commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
