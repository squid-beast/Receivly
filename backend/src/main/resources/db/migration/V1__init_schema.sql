-- V1: Initial schema for Receivly
-- All tables use UUID primary keys and timestamptz for audit columns

-- ============================================================
-- WORKSPACES
-- ============================================================
CREATE TABLE workspaces (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name   VARCHAR(255)    NOT NULL,
    currency        VARCHAR(3)      NOT NULL DEFAULT 'USD',
    default_payment_terms VARCHAR(20) NOT NULL DEFAULT 'NET_30',
    onboarding_completed BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    password        VARCHAR(255)    NOT NULL,
    workspace_id    UUID            NOT NULL REFERENCES workspaces(id),
    role            VARCHAR(20)     NOT NULL DEFAULT 'OWNER',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX idx_users_workspace ON users(workspace_id);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID            NOT NULL REFERENCES workspaces(id),
    name            VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    payment_terms   VARCHAR(20)     NOT NULL DEFAULT 'NET_30',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_workspace ON customers(workspace_id);

-- ============================================================
-- INVOICES
-- ============================================================
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID            NOT NULL REFERENCES workspaces(id),
    customer_id     UUID            NOT NULL REFERENCES customers(id),
    invoice_number  VARCHAR(20)     NOT NULL,
    description     VARCHAR(1000)   NOT NULL,
    amount          NUMERIC(12, 2)  NOT NULL,
    currency        VARCHAR(3)      NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'SENT',
    due_date        DATE            NOT NULL,
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT uq_invoices_number UNIQUE (invoice_number)
);

CREATE INDEX idx_invoices_workspace ON invoices(workspace_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(workspace_id, status);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID            NOT NULL REFERENCES invoices(id),
    amount          NUMERIC(12, 2)  NOT NULL,
    currency        VARCHAR(3)      NOT NULL,
    note            VARCHAR(500),
    paid_at         TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);

-- ============================================================
-- REMINDERS
-- ============================================================
CREATE TABLE reminders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID            NOT NULL REFERENCES invoices(id),
    days_past_due   INTEGER         NOT NULL,
    recipient_email VARCHAR(255)    NOT NULL,
    sent_at         TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_reminders_invoice ON reminders(invoice_id);

-- ============================================================
-- WEEKLY SUMMARIES
-- ============================================================
CREATE TABLE weekly_summaries (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID            NOT NULL REFERENCES workspaces(id),
    week_start          DATE            NOT NULL,
    week_end            DATE            NOT NULL,
    invoices_sent       INTEGER         NOT NULL DEFAULT 0,
    invoices_paid       INTEGER         NOT NULL DEFAULT 0,
    invoices_overdue    INTEGER         NOT NULL DEFAULT 0,
    total_collected     NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    total_outstanding   NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_weekly_summaries_workspace ON weekly_summaries(workspace_id);
