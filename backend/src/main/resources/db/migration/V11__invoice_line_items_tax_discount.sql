-- Line items and tax/discount for invoices
ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12, 2) DEFAULT 0;

-- Backfill: existing invoices get subtotal = amount, total stays in amount
UPDATE invoices SET subtotal = amount, tax_rate = 0, discount_amount = 0 WHERE subtotal IS NULL;
ALTER TABLE invoices ALTER COLUMN subtotal SET NOT NULL;
ALTER TABLE invoices ALTER COLUMN tax_rate SET NOT NULL;
ALTER TABLE invoices ALTER COLUMN discount_amount SET NOT NULL;

CREATE TABLE IF NOT EXISTS invoice_line_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id  UUID            NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(500)   NOT NULL,
    quantity    INTEGER        NOT NULL DEFAULT 1,
    unit_price  NUMERIC(12, 2) NOT NULL,
    amount      NUMERIC(12, 2) NOT NULL
);

CREATE INDEX idx_invoice_line_items_invoice ON invoice_line_items(invoice_id);
