-- Add issue_date (auto today) and sent_at (when send stub is called)
ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS issue_date DATE,
    ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

-- Backfill issue_date from created_at for existing rows
UPDATE invoices SET issue_date = created_at::date WHERE issue_date IS NULL;
ALTER TABLE invoices ALTER COLUMN issue_date SET DEFAULT CURRENT_DATE;
ALTER TABLE invoices ALTER COLUMN issue_date SET NOT NULL;
