-- V2: Make invoice numbers unique per workspace instead of globally

ALTER TABLE invoices
    DROP CONSTRAINT IF EXISTS uq_invoices_number;

ALTER TABLE invoices
    ADD CONSTRAINT uq_invoices_workspace_number
        UNIQUE (workspace_id, invoice_number);

