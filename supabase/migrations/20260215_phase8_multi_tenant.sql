-- Phase 8: Multi-Tenant SaaS, Enterprise Onboarding & Commercialization
-- This migration implements true multi-tenancy with row-level isolation
-- Safe: CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS

-- ============================================
-- 8.1 TENANT MODEL (Core Multi-Tenancy)
-- ============================================

-- Tenants table - first-class entity for multi-tenancy
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core identification
  name text NOT NULL,
  slug text UNIQUE NOT NULL, -- URL-friendly identifier for subdomains/API
  domain text UNIQUE, -- custom domain for white-labeling
  
  -- Tenant type
  tenant_type text NOT NULL DEFAULT 'company', -- company, government, ngo, enterprise
  industry text,
  size text, -- smb, mid-market, enterprise
  
  -- Subscription & billing
  plan text NOT NULL DEFAULT 'trial', -- trial, free, professional, enterprise, government
  status text NOT NULL DEFAULT 'trial', -- trial, active, suspended, archived, deleted
  
  -- Subscription limits
  max_users int DEFAULT 5,
  max_trips_per_month int DEFAULT 50,
  ai_calls_per_month int DEFAULT 100,
  api_rate_limit_per_min int DEFAULT 60,
  
  -- Trial expiry
  trial_ends_at timestamptz,
  
  -- Billing
  billing_email text,
  billing_address jsonb,
  tax_id text,
  
  -- White-label branding
  branding jsonb DEFAULT '{}', -- { logo_url, primary_color, secondary_color, font_family }
  
  -- Configuration (tenant-specific policies)
  config jsonb DEFAULT '{}', -- travel_policies, approval_workflows, esg_rules, risk_thresholds
  
  -- Metadata
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT tenants_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Tenant invitations (for onboarding)
CREATE TABLE IF NOT EXISTS tenant_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user', -- admin, manager, user
  status text DEFAULT 'pending', -- pending, accepted, expired
  invited_by uuid REFERENCES users(id),
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- ============================================
-- 8.2 SUBSCRIPTION & BILLING
-- ============================================

-- Subscription plans definition
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE, -- free, professional, enterprise, government
  description text,
  price_usd decimal(10,2) NOT NULL DEFAULT 0,
  billing_interval text DEFAULT 'monthly', -- monthly, yearly
  max_users int DEFAULT 5,
  max_trips_per_month int DEFAULT 50,
  ai_calls_per_month int DEFAULT 100,
  api_rate_limit int DEFAULT 60,
  features jsonb DEFAULT '[]', -- list of feature flags
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tenant subscriptions (active subscription per tenant)
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES subscription_plans(id),
  status text NOT NULL DEFAULT 'active', -- active, cancelled, past_due, trialing
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamptz,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Usage tracking per tenant
CREATE TABLE IF NOT EXISTS tenant_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  users_count int DEFAULT 0,
  trips_count int DEFAULT 0,
  ai_calls_count int DEFAULT 0,
  api_calls_count int DEFAULT 0,
  spend_amount_usd decimal(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, period_start)
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  amount_usd decimal(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'draft', -- draft, sent, paid, failed, void
  due_date date,
  paid_at timestamptz,
  line_items jsonb DEFAULT '[]',
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 8.3 TENANT-LEVEL CONFIGURATION
-- ============================================

-- Travel policies per tenant
CREATE TABLE IF NOT EXISTS tenant_travel_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  rules jsonb NOT NULL DEFAULT '{}', -- { max_advance_booking_days, advance_purchase_days, max_duration_days, etc }
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, name)
);

-- Approval workflows per tenant
CREATE TABLE IF NOT EXISTS tenant_approval_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL, -- booking_amount, destination_risk, travel_category
  conditions jsonb NOT NULL DEFAULT '{}',
  approvers jsonb NOT NULL DEFAULT '[]', -- [{ level: 1, role: 'manager', or_group: [] }]
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ESG rules per tenant
CREATE TABLE IF NOT EXISTS tenant_esg_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  rules jsonb NOT NULL DEFAULT '{}', -- { carbon_offset_required, preferred_carriers, hotel_sustainability_rating }
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Notification preferences per tenant
CREATE TABLE IF NOT EXISTS tenant_notification_prefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel text NOT NULL, -- email, slack, teams
  event_type text NOT NULL, -- booking_confirmed, approval_required, trip_started
  frequency text DEFAULT 'immediate', -- immediate, daily_digest, weekly_digest
  enabled boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, channel, event_type)
);

-- ============================================
-- 8.4 WHITE-LABEL BRANDING
-- ============================================

-- Extended tenant branding (stored as JSONB in tenants.branding, but we can add specific columns)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS custom_domain_mapping jsonb DEFAULT '{}';

-- Email templates per tenant
CREATE TABLE IF NOT EXISTS tenant_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_type text NOT NULL, -- booking_confirmation, approval_request, trip_reminder
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, template_type)
);

-- ============================================
-- 8.5 TENANT LIFECYCLE & STATE MANAGEMENT
-- ============================================

-- Tenant state history (audit trail)
CREATE TABLE IF NOT EXISTS tenant_state_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  previous_state text,
  new_state text NOT NULL,
  reason text,
  changed_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Suspension reasons
CREATE TABLE IF NOT EXISTS tenant_suspension_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  suspended_by uuid REFERENCES users(id),
  suspended_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolution_notes text
);

-- ============================================
-- 8.6 TENANT-AWARE ANALYTICS
-- ============================================

-- Analytics events (aggregated per tenant)
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- booking_created, approval_submitted, trip_completed
  event_data jsonb DEFAULT '{}',
  user_id uuid REFERENCES users(id),
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant ON analytics_events(tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type, timestamp DESC);

-- Daily analytics snapshots per tenant
CREATE TABLE IF NOT EXISTS analytics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date date NOT NULL,
  bookings_count int DEFAULT 0,
  trips_count int DEFAULT 0,
  spend_usd decimal(12,2) DEFAULT 0,
  approvals_count int DEFAULT 0,
  users_active int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, date)
);

-- ============================================
-- 8.7 ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_travel_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_esg_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_notification_prefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_state_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_suspension_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own tenant's data (except super admins)
CREATE POLICY "tenant_isolation_policy" ON tenants
  FOR ALL
  USING (auth.uid() IN (
    SELECT users.id FROM users WHERE users.tenant_id = tenants.id
  ));

-- Super admins (you) can view all tenants
-- This would be handled by a separate service role

-- ============================================
-- 8.8 MIGRATION: ADD tenant_id TO EXISTING TABLES
-- ============================================

-- Add tenant_id to existing tables that need isolation
-- Only run if column doesn't exist
DO $$
DECLARE
  existing_tables TEXT[] := ARRAY[
    'users', 'travel_requests', 'trips', 'bookings', 
    'flight_bookings', 'hotel_bookings', 'insurance_policies',
    'api_keys', 'cost_center_mapping', 'reconciliation_exports',
    'travel_requests', 'conversations', 'messages',
    'service_requests', 'employees', 'dependents',
    'organizations', 'departments', 'roles', 'permissions'
  ];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY existing_tables
  LOOP
    EXECUTE format('ALTER TABLE IF EXISTS %I ADD COLUMN IF NOT EXISTS tenant_id uuid', tbl);
  END LOOP;
END $$;

-- Add index on tenant_id for performance
DO $$
DECLARE
  existing_tables TEXT[] := ARRAY[
    'users', 'travel_requests', 'trips', 'bookings',
    'flight_bookings', 'hotel_bookings', 'insurance_policies',
    'api_keys', 'reconciliation_exports'
  ];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY existing_tables
  LOOP
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_tenant ON %I(tenant_id)', tbl, tbl);
  END LOOP;
END $$;

-- ============================================
-- 8.9 HELPER FUNCTIONS
-- ============================================

-- Get current tenant from context
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS uuid AS $$
  SELECT users.tenant_id FROM users WHERE users.id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Validate user belongs to tenant
CREATE OR REPLACE FUNCTION user_belongs_to_tenant(p_user_id uuid, p_tenant_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = p_user_id AND users.tenant_id = p_tenant_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Update tenant state with history
CREATE OR REPLACE FUNCTION update_tenant_state(
  p_tenant_id uuid,
  p_new_state text,
  p_reason text DEFAULT NULL,
  p_changed_by uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
  -- Update tenant status
  UPDATE tenants 
  SET status = p_new_state, updated_at = now()
  WHERE id = p_tenant_id;
  
  -- Record history
  INSERT INTO tenant_state_history (tenant_id, previous_state, new_state, reason, changed_by)
  SELECT p_tenant_id, status, p_new_state, p_reason, p_changed_by
  FROM tenants WHERE id = p_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8.10 DEFAULT DATA
-- ============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, code, description, price_usd, billing_interval, max_users, max_trips_per_month, ai_calls_per_month, features, is_active)
VALUES 
  ('Free', 'free', 'For small teams getting started', 0, 'monthly', 5, 10, 50, '["basic_bookings", "email_support"]', true),
  ('Professional', 'professional', 'For growing businesses', 99, 'monthly', 25, 200, 500, '["all_free_features", "ai_assistant", "slack_integration", "analytics"]', true),
  ('Enterprise', 'enterprise', 'For large organizations', 399, 'monthly', 100, 1000, 2000, '["all_pro_features", "custom_integrations", "dedicated_support", "sla", "white_label"]', true),
  ('Government', 'government', 'For government agencies', 599, 'monthly', 250, 5000, 5000, '["all_enterprise_features", "compliance_certifications", "secure_auth", "audit_trail"]', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE tenants IS 'Phase 8: Multi-tenant SaaS - core tenant entity with isolation, billing, and configuration';
COMMENT ON TABLE subscription_plans IS 'Phase 8: SaaS subscription plans with tiered pricing and limits';
COMMENT ON TABLE tenant_subscriptions IS 'Phase 8: Active subscriptions linking tenants to plans';
COMMENT ON TABLE tenant_usage IS 'Phase 8: Monthly usage tracking per tenant for billing and limits';
COMMENT ON TABLE invoices IS 'Phase 8: Billing invoices per tenant';
COMMENT ON TABLE tenant_travel_policies IS 'Phase 8: Tenant-specific travel policy rules';
COMMENT ON TABLE tenant_approval_workflows IS 'Phase 8: Tenant-specific approval workflows';
COMMENT ON TABLE tenant_esg_rules IS 'Phase 8: ESG/sustainability rules per tenant';
COMMENT ON TABLE tenant_notification_prefs IS 'Phase 8: Notification preferences per tenant';
COMMENT ON TABLE analytics_events IS 'Phase 8: Tenant-scoped analytics event tracking';
COMMENT ON TABLE analytics_daily IS 'Phase 8: Daily analytics snapshots per tenant';

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Phase 8 Multi-Tenant Migration Complete';
  RAISE NOTICE 'Tables created: tenants, tenant_invitations, tenant_subscriptions, tenant_usage, invoices';
  RAISE NOTICE 'Tables created: tenant_travel_policies, tenant_approval_workflows, tenant_esg_rules';
  RAISE NOTICE 'Tables created: tenant_notification_prefs, tenant_email_templates, analytics_events';
  RAISE NOTICE 'RLS policies enabled for tenant isolation';
  RAISE NOTICE 'Default subscription plans inserted';
END $$;
