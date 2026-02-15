-- =============================================
-- MULTI SERVICIOS 360 — New Tables
-- Run this in Supabase SQL Editor
-- =============================================

-- ============ SALES REPS ============
CREATE TABLE IF NOT EXISTS sales_reps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Commission on document sales from offices they signed up
  commission_rate NUMERIC(5,2) DEFAULT 5 CHECK (commission_rate >= 0 AND commission_rate <= 50),
  commission_duration_months INTEGER DEFAULT 1 CHECK (commission_duration_months >= 1 AND commission_duration_months <= 12),
  
  -- Setup fee share (owner-only, hidden from rep)
  setup_fee_share_enabled BOOLEAN DEFAULT false,
  setup_fee_share_percent NUMERIC(5,2) DEFAULT 0 CHECK (setup_fee_share_percent >= 0 AND setup_fee_share_percent <= 100),
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Links a sales rep to each office they signed up
CREATE TABLE IF NOT EXISTS sales_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_rep_id UUID REFERENCES sales_reps(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  
  commission_rate NUMERIC(5,2) NOT NULL,
  duration_months INTEGER NOT NULL,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL,
  
  setup_fee_amount NUMERIC(10,2) DEFAULT 0,
  setup_fee_paid BOOLEAN DEFAULT false,
  
  total_document_sales NUMERIC(10,2) DEFAULT 0,
  total_commission_earned NUMERIC(10,2) DEFAULT 0,
  total_commission_paid NUMERIC(10,2) DEFAULT 0,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ PROFESSIONALS ============
CREATE TABLE IF NOT EXISTS professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  profession TEXT NOT NULL CHECK (profession IN ('attorney', 'notary', 'cpa', 'realtor', 'other')),
  license_number TEXT,
  specialty TEXT,
  languages TEXT DEFAULT 'en,es',
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ STAFF WORKERS ============
CREATE TABLE IF NOT EXISTS staff_workers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'worker' CHECK (role IN ('worker', 'manager')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_sales_reps_status ON sales_reps(status);
CREATE INDEX IF NOT EXISTS idx_sales_commissions_rep ON sales_commissions(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_sales_commissions_partner ON sales_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_professionals_profession ON professionals(profession);
CREATE INDEX IF NOT EXISTS idx_professionals_status ON professionals(status);
CREATE INDEX IF NOT EXISTS idx_staff_workers_email ON staff_workers(email);
CREATE INDEX IF NOT EXISTS idx_staff_workers_status ON staff_workers(status);

-- ============ AUTO UPDATE TIMESTAMPS ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sales_reps_ts') THEN
    CREATE TRIGGER update_sales_reps_ts BEFORE UPDATE ON sales_reps FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sales_commissions_ts') THEN
    CREATE TRIGGER update_sales_commissions_ts BEFORE UPDATE ON sales_commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_professionals_ts') THEN
    CREATE TRIGGER update_professionals_ts BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_staff_workers_ts') THEN
    CREATE TRIGGER update_staff_workers_ts BEFORE UPDATE ON staff_workers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END;
$$;
