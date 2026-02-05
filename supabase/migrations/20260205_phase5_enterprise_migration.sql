-- Phase 5 enterprise-grade schema additions and RLS/audit protections
-- Adds: tenants, tenant settings, enhanced roles/assignments, immutable audit logs,
-- invoices & refunds (Rwanda-compliant numbering helper), consents, retention policies,
-- partners & partner metrics, and example RLS policies.
-- NOTE: Adjust JWT claim keys in RLS policies to match your Auth system (see comments).

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tenants (companies / corporate clients)
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  domain text,
  external_id text, -- mapping to external systems
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Tenant settings (quick access; optional denormalization)
CREATE TABLE IF NOT EXISTS tenant_settings (
  tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  branding jsonb DEFAULT '{}'::jsonb,
  currency_preference text,
  languages text[] DEFAULT '{}',
  country_rules jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enhance roles table: allow tenant-scoped roles and canonical permissions
ALTER TABLE IF EXISTS roles
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_system boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]'::jsonb;

-- User roles mapping (multi-tenant)
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  assigned_by uuid,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role_id, tenant_id)
);

-- Audit logs - immutable append-only store
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id),
  entity_type text NOT NULL,
  entity_id text,
  action text NOT NULL, -- e.g., 'create','update','delete','approve','payment'
  performed_by uuid, -- user id
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Prevent updates/deletes on audit_logs by trigger
CREATE OR REPLACE FUNCTION fn_prevent_audit_modifications()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is immutable; updates/deletes are not allowed';
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_prevent_change ON audit_logs;
CREATE TRIGGER trg_audit_prevent_change
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION fn_prevent_audit_modifications();

-- Invoice numbering helpers and invoices table
CREATE TABLE IF NOT EXISTS invoice_counters (
  tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  year int NOT NULL,
  next_seq bigint NOT NULL DEFAULT 1,
  UNIQUE (tenant_id, year)
);

-- Generate Rwanda-style invoice number.
-- This function returns a string like: RWA-{tenant_short}-{YYYY}-{000001}
CREATE OR REPLACE FUNCTION generate_rwanda_invoice_number(p_tenant uuid)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  v_tenant_short text;
  v_year int := EXTRACT(YEAR FROM now())::int;
  v_seq bigint;
BEGIN
  -- tenant_short fallback: first 4 letters of tenant name or tenant id prefix
  SELECT COALESCE(LEFT(name,4), LEFT(p_tenant::text,4)) INTO v_tenant_short FROM tenants WHERE id = p_tenant;
  IF NOT FOUND THEN
    v_tenant_short := LEFT(p_tenant::text,4);
  END IF;

  LOOP
    -- upsert counter row for this tenant/year
    INSERT INTO invoice_counters(tenant_id, year, next_seq)
      VALUES (p_tenant, v_year, 2)
      ON CONFLICT (tenant_id, year) DO UPDATE SET next_seq = invoice_counters.next_seq + 1
      RETURNING (COALESCE(invoice_counters.next_seq, 1) - 1) INTO v_seq;

    -- If we obtained a sequence, build the number
    IF v_seq IS NOT NULL THEN
      RETURN format('RWA-%s-%s-%s', upper(v_tenant_short), v_year, lpad(v_seq::text, 6, '0'));
    END IF;
  END LOOP;
END;
$$;

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number text UNIQUE,
  original_invoice_id uuid REFERENCES invoices(id), -- for refunds referencing original invoice
  issued_to jsonb, -- snapshot of customer/company billing details
  issued_by uuid, -- user id
  invoice_date timestamptz DEFAULT now(),
  currency text NOT NULL,
  exchange_rate numeric(20,8), -- snapshot of rate at time of transaction
  exchange_rate_source text,
  subtotal numeric(18,2) NOT NULL DEFAULT 0,
  vat_amount numeric(18,2) NOT NULL DEFAULT 0,
  service_fee_amount numeric(18,2) NOT NULL DEFAULT 0,
  total_amount numeric(18,2) NOT NULL DEFAULT 0,
  vat_rate numeric(5,2) DEFAULT 0, -- percentage
  service_fee_rate numeric(5,2) DEFAULT 0, -- percentage
  status text DEFAULT 'issued', -- issued, paid, refunded, cancelled
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Before insert trigger to auto-generate invoice_number if not provided
CREATE OR REPLACE FUNCTION fn_invoice_before_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := generate_rwanda_invoice_number(NEW.tenant_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_before_insert ON invoices;
CREATE TRIGGER trg_invoice_before_insert
  BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION fn_invoice_before_insert();

-- Refunds table referencing original invoice and audit trail requirement
CREATE TABLE IF NOT EXISTS refunds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  refund_number text UNIQUE,
  original_invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  requested_by uuid,
  approved_by uuid,
  amount numeric(18,2) NOT NULL,
  currency text NOT NULL,
  exchange_rate numeric(20,8),
  reason text,
  status text DEFAULT 'requested', -- requested, approved, processed, rejected
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Consent tracking
CREATE TABLE IF NOT EXISTS consents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  tenant_id uuid,
  consent_type text NOT NULL, -- e.g., 'privacy_policy','marketing_emails'
  version text, -- version of terms accepted
  granted boolean NOT NULL DEFAULT true,
  granted_at timestamptz DEFAULT now(),
  revoked_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Data retention policies
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  resource text NOT NULL, -- e.g., 'travel_request','documents','audit_logs'
  retention_days int NOT NULL,
  policy jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Partner & vendor management
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  partner_type text NOT NULL, -- airline, hotel, visa, insurance, etc.
  name text NOT NULL,
  contact jsonb DEFAULT '{}'::jsonb,
  sla jsonb DEFAULT '{}'::jsonb,
  commission_percent numeric(5,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  period_start date,
  period_end date,
  bookings_count int DEFAULT 0,
  on_time_rate numeric(5,2) DEFAULT 100,
  complaints_count int DEFAULT 0,
  revenue numeric(18,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Example: enable RLS and create tenant-scoped policies for key tables
-- IMPORTANT: Replace 'request.jwt.claims.tenant_id' with the actual JWT claim path your auth issues.
-- Supabase: use current_setting('jwt.claims.tenant', true) if set by your auth pipeline.
-- Below we assume a JWT claim named "tenant_id". Adjust as needed.

-- Helper function to read tenant claim (returns NULL if not set)
CREATE OR REPLACE FUNCTION get_jwt_tenant()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT (current_setting('jwt.claims.tenant_id', true))::uuid;
$$;

-- Apply RLS to data-bearing tables
ALTER TABLE IF EXISTS invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS partner_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: tenants can only access rows that match their tenant_id OR system/admins (role check)
-- Note: the is_admin() function is application-specific; you should replace policy checks
-- with appropriate role/claim checks for your environment.

-- Allow insert when tenant_id equals JWT tenant claim (or when tenant_id is null for system)
CREATE POLICY tenant_insert_policy ON invoices
  FOR INSERT
  USING (true)
  WITH CHECK (tenant_id IS NULL OR tenant_id = get_jwt_tenant());

CREATE POLICY tenant_select_policy ON invoices
  FOR SELECT USING (tenant_id IS NULL OR tenant_id = get_jwt_tenant());

CREATE POLICY tenant_update_policy ON invoices
  FOR UPDATE USING (tenant_id IS NULL OR tenant_id = get_jwt_tenant());

CREATE POLICY tenant_delete_policy ON invoices
  FOR DELETE USING (false); -- prevent deletes; use status changes instead

-- Repeat similar policies for refunds, partners, consents, user_roles
CREATE POLICY tenant_select_on_refunds ON refunds
  FOR SELECT USING (tenant_id IS NULL OR tenant_id = get_jwt_tenant());
CREATE POLICY tenant_insert_on_refunds ON refunds
  FOR INSERT USING (true) WITH CHECK (tenant_id IS NULL OR tenant_id = get_jwt_tenant());

CREATE POLICY tenant_select_on_partners ON partners
  FOR SELECT USING (tenant_id IS NULL OR tenant_id = get_jwt_tenant());
CREATE POLICY tenant_insert_on_partners ON partners
  FOR INSERT USING (true) WITH CHECK (tenant_id IS NULL OR tenant_id = get_jwt_tenant());

CREATE POLICY tenant_select_on_consents ON consents
  FOR SELECT USING (tenant_id IS NULL OR tenant_id = get_jwt_tenant());
CREATE POLICY tenant_insert_on_consents ON consents
  FOR INSERT USING (true) WITH CHECK (tenant_id IS NULL OR tenant_id = get_jwt_tenant());

CREATE POLICY tenant_select_on_user_roles ON user_roles
  FOR SELECT USING (tenant_id IS NULL OR tenant_id = get_jwt_tenant());
CREATE POLICY tenant_insert_on_user_roles ON user_roles
  FOR INSERT USING (true) WITH CHECK (tenant_id IS NULL OR tenant_id = get_jwt_tenant());

-- Ensure audit_logs are readable by auditors/admins only via policies (example)
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_select_policy ON audit_logs
  FOR SELECT USING (
    -- allow when tenant matches or when JWT has elevated claim (e.g., admin=true)
    tenant_id IS NULL OR tenant_id = get_jwt_tenant() OR (current_setting('jwt.claims.is_admin', true) = 'true')
  );
-- Prevent inserts from clients; application server should INSERT using service role
CREATE POLICY audit_no_client_insert ON audit_logs
  FOR INSERT USING (current_setting('jwt.claims.is_service_role', true) = 'true');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_date ON invoices (tenant_id, invoice_date);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_time ON audit_logs (tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_partners_tenant_type ON partners (tenant_id, partner_type);

-- Admin note:
-- - Application server should write to audit_logs using a service-role key to bypass client policies.
-- - Use the provided get_jwt_tenant() helper or replace with your preferred JWT claim accessor.
-- - RLS policies above are example templates. Add stricter checks mapping to your role claims (e.g., is_admin, roles).
-- - For GDPR: consider partitioning logs or encrypting PII columns; handle deletions via retention jobs that anonymize rather than delete audit entries.

-- End migration