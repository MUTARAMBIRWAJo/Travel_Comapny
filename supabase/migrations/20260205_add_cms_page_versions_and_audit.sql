-- Migration: add cms_page_versions table and audit logs for admin edits & auth events
BEGIN;

-- Page versions table
CREATE TABLE IF NOT EXISTS cms_page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  title_en text,
  title_rw text,
  title_fr text,
  slug text,
  content_en text,
  content_rw text,
  content_fr text,
  seo_title text,
  seo_description text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_page_versions_page_key ON cms_page_versions (page_key);

-- Audit log table for admin actions and auth events
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

COMMIT;