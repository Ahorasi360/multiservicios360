-- Run AFTER the main create-all-new-tables.sql
-- Adds password support for Sales Rep portal login

ALTER TABLE sales_reps ADD COLUMN IF NOT EXISTS password_hash TEXT;
