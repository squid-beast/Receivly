-- V3: Increase max length of invoice_number to support
-- format INV-YYYY-CLIENT_CODE-00000.

ALTER TABLE invoices
    ALTER COLUMN invoice_number TYPE VARCHAR(50);

