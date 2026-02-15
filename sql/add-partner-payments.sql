-- Run this in Supabase SQL Editor
-- Adds membership payment tracking to partners table

ALTER TABLE partners ADD COLUMN IF NOT EXISTS package_name TEXT DEFAULT 'basic';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS setup_fee_amount NUMERIC(10,2) DEFAULT 499;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS setup_fee_paid BOOLEAN DEFAULT false;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS setup_fee_paid_at TIMESTAMPTZ;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS setup_fee_payment_id TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS annual_fee_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS annual_fee_waived BOOLEAN DEFAULT false;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS annual_fee_waived_reason TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Payment history for partners (setup fees + renewals)
CREATE TABLE IF NOT EXISTS partner_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('setup_fee', 'annual_renewal', 'upgrade', 'other')),
  amount NUMERIC(10,2) NOT NULL,
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_payments_partner ON partner_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_payments_status ON partner_payments(status);
