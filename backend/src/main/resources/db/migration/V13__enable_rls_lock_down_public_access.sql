-- V13: Enable Row Level Security and revoke public/anon access
--
-- WHY: Supabase exposes a public REST API (PostgREST) that uses the "anon"
-- and "authenticated" roles. Without RLS and proper grants, anyone with
-- the project URL + anon key can read/write ALL tables directly —
-- bypassing the Spring Boot backend entirely.
--
-- HOW THIS WORKS:
--   1. Enable RLS on every table → blocks all access unless a policy allows it
--   2. Revoke all permissions from anon/authenticated roles → no REST API access
--   3. The Spring Boot backend connects as "postgres" which BYPASSES RLS
--      (table owner), so all backend queries continue to work unchanged
-- =============================================================================

-- ============================================================
-- Step 1: Enable Row Level Security on ALL tables
-- ============================================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Step 2: Revoke ALL privileges from public-facing roles
-- These roles are used by Supabase's REST API (PostgREST)
-- ============================================================
REVOKE ALL ON workspaces FROM anon, authenticated;
REVOKE ALL ON users FROM anon, authenticated;
REVOKE ALL ON customers FROM anon, authenticated;
REVOKE ALL ON invoices FROM anon, authenticated;
REVOKE ALL ON payments FROM anon, authenticated;
REVOKE ALL ON reminders FROM anon, authenticated;
REVOKE ALL ON weekly_summaries FROM anon, authenticated;
REVOKE ALL ON invoice_line_items FROM anon, authenticated;

-- Also revoke from the public schema default
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;

-- ============================================================
-- Step 3: No RLS policies are created intentionally
-- With RLS enabled and zero policies, the anon/authenticated roles
-- are denied ALL access (SELECT, INSERT, UPDATE, DELETE).
-- The postgres role (used by Spring Boot) bypasses RLS as table owner.
-- ============================================================
