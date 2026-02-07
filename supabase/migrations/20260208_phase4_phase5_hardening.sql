-- Phase 4 & 5 hardening: sessions, access logs, audit columns, legal page keys.
-- Safe: IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

-- Server-side sessions for expiration and revocation
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);

-- Access log for auth events (login success/failure) and high-value admin actions
CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- 'login_success', 'login_failure', 'logout', 'admin_action'
  user_id uuid,
  email text,
  ip_address text,
  user_agent text,
  resource text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_event_type ON access_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);

-- Ensure audit_logs has performed_by / actor_id for compatibility (phase5 uses performed_by)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'performed_by') THEN
    ALTER TABLE audit_logs ADD COLUMN performed_by uuid;
    RAISE NOTICE 'Added audit_logs.performed_by';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'tenant_id') THEN
    ALTER TABLE audit_logs ADD COLUMN tenant_id uuid;
    RAISE NOTICE 'Added audit_logs.tenant_id';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'metadata') THEN
    ALTER TABLE audit_logs ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added audit_logs.metadata';
  END IF;
END $$;

-- Legal CMS page keys (used by seed/default content)
-- No table change; application will create cms_pages/cms_page_versions for these slugs:
-- privacy-policy, terms-and-conditions, travel-liability-disclaimer, data-protection-notice,
-- cookies-policy, corporate-travel-policy-template, government-regulatory-notice

COMMENT ON TABLE access_logs IS 'Phase 4: Access logs for auth and admin actions';
COMMENT ON TABLE sessions IS 'Phase 4: Server-side sessions for expiration and revocation';
