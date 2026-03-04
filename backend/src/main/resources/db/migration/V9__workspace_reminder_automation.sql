-- Toggle reminder automation per workspace (MVP: Settings)
ALTER TABLE workspaces
    ADD COLUMN IF NOT EXISTS reminder_automation_enabled BOOLEAN NOT NULL DEFAULT true;
