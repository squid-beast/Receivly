-- V4: Add composite indexes to cover common query patterns

-- ============================================================
-- INVOICES
-- ============================================================

-- Scheduler: findByStatusAndDueDateBefore(status, date) — runs daily
CREATE INDEX idx_invoices_status_due_date
    ON invoices (status, due_date);

-- Listing: findByWorkspaceIdOrderByCreatedAtDesc — dashboard, invoice list
CREATE INDEX idx_invoices_workspace_created
    ON invoices (workspace_id, created_at DESC);

-- Filtering: findByWorkspaceIdAndStatusOrderByDueDateAsc
-- Replaces the less selective idx_invoices_status (workspace_id, status) from V1
DROP INDEX IF EXISTS idx_invoices_status;
CREATE INDEX idx_invoices_workspace_status_due
    ON invoices (workspace_id, status, due_date);

-- ============================================================
-- CUSTOMERS
-- ============================================================

-- Listing: findByWorkspaceIdOrderByCreatedAtDesc
CREATE INDEX idx_customers_workspace_created
    ON customers (workspace_id, created_at DESC);

-- ============================================================
-- PAYMENTS
-- ============================================================

-- Detail view: findByInvoiceIdOrderByPaidAtDesc
-- Replaces the single-column idx_payments_invoice from V1
DROP INDEX IF EXISTS idx_payments_invoice;
CREATE INDEX idx_payments_invoice_paid
    ON payments (invoice_id, paid_at DESC);

-- ============================================================
-- REMINDERS
-- ============================================================

-- Detail view: findByInvoiceIdOrderBySentAtDesc
-- Replaces the single-column idx_reminders_invoice from V1
DROP INDEX IF EXISTS idx_reminders_invoice;
CREATE INDEX idx_reminders_invoice_sent
    ON reminders (invoice_id, sent_at DESC);

-- Scheduler: existsByInvoiceIdAndDaysPastDue — dedup check on every overdue invoice
CREATE INDEX idx_reminders_invoice_days
    ON reminders (invoice_id, days_past_due);

-- ============================================================
-- WEEKLY SUMMARIES
-- ============================================================

-- Scheduler: existsByWorkspaceIdAndWeekStart — dedup check
-- Listing: findByWorkspaceIdOrderByWeekStartDesc
-- Replaces single-column idx_weekly_summaries_workspace from V1
DROP INDEX IF EXISTS idx_weekly_summaries_workspace;
CREATE INDEX idx_weekly_summaries_workspace_week
    ON weekly_summaries (workspace_id, week_start DESC);
