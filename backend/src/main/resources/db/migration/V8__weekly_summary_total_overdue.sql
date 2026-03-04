-- Add explicit overdue amount to weekly summaries (MVP: overdue count & amount)
ALTER TABLE weekly_summaries
    ADD COLUMN IF NOT EXISTS total_overdue NUMERIC(12, 2) NOT NULL DEFAULT 0;
