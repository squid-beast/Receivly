-- Add timezone to workspaces for business-level date/time display and reminders
ALTER TABLE workspaces
    ADD COLUMN IF NOT EXISTS timezone VARCHAR(64) NOT NULL DEFAULT 'UTC';
