-- Add phone and notes to customers (MVP: phone number, notes optional)
ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS notes VARCHAR(2000);
