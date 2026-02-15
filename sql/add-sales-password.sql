-- Run this AFTER the main create-all-new-tables.sql
-- Adds password_hash to sales_reps for their portal login
ALTER TABLE sales_reps ADD COLUMN IF NOT EXISTS password_hash TEXT;
