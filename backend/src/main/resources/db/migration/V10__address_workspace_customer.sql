-- Sender (workspace) and billing (customer) addresses for invoice display
ALTER TABLE workspaces
    ADD COLUMN IF NOT EXISTS address VARCHAR(500);

ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS address VARCHAR(500);
