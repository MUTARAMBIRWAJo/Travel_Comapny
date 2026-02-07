-- =============================================================================
-- BENI PROJECT — Full schema + seed for Supabase SQL Editor (no users seed)
-- Copy-paste this entire file into Supabase Dashboard → SQL Editor → New query → Run
-- Users table is created for FK integrity but left empty; add users via Auth or INSERT.
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- PART 1: USERS (required for FKs; do not seed)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL DEFAULT '',
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  role VARCHAR(50) NOT NULL DEFAULT 'traveler',
  preferred_language VARCHAR(10) DEFAULT 'en',
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  company_id UUID,
  avatar_url TEXT,
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  active BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);

-- =============================================================================
-- PART 2: CORE TABLES (no user FKs or optional)
-- =============================================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  industry VARCHAR(100),
  travel_budget DECIMAL(15, 2),
  esg_settings JSONB DEFAULT '{"tracking_enabled": false, "carbon_offset": false}',
  logo_url TEXT,
  billing_email VARCHAR(255),
  settings JSONB DEFAULT '{}',
  admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  currency VARCHAR(10),
  description TEXT,
  image_url TEXT,
  climate TEXT,
  best_season VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Packages (app API reads from travel_packages view)
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  title_en VARCHAR(255),
  description TEXT,
  description_en TEXT,
  category VARCHAR(100),
  price_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  price_rwf DECIMAL(15, 2),
  duration_days INTEGER,
  duration VARCHAR(100),
  destination_id UUID REFERENCES destinations(id),
  itinerary JSONB,
  image_url TEXT,
  amenities JSONB DEFAULT '[]',
  max_travelers INTEGER,
  available_from DATE,
  available_to DATE,
  status VARCHAR(20) DEFAULT 'active',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_order ON packages(order_index);

-- View for /api/packages (expects travel_packages)
DROP VIEW IF EXISTS travel_packages;
CREATE VIEW travel_packages AS SELECT id, title_en AS title, title, description_en AS description, description, category, price_usd, price_rwf, duration, duration_days, destination_id, image_url, status, order_index, created_at, updated_at FROM packages;

-- =============================================================================
-- PART 3: TABLES REFERENCING USERS / COMPANIES / DESTINATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS travel_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  type VARCHAR(50) NOT NULL DEFAULT 'leisure',
  destination_id UUID REFERENCES destinations(id),
  destination VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending',
  assigned_agent_id UUID REFERENCES users(id),
  budget_usd DECIMAL(12, 2),
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_travel_requests_user_id ON travel_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_requests_status ON travel_requests(status);

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES travel_requests(id),
  user_id UUID REFERENCES users(id),
  itinerary JSONB,
  status VARCHAR(50) DEFAULT 'planning',
  carbon_footprint_kg DECIMAL(10, 2),
  total_cost_usd DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  pdf_path TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  issued_date DATE,
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invoices_trip_id ON invoices(trip_id);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  title VARCHAR(255),
  read_status BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  language VARCHAR(10),
  category VARCHAR(100),
  featured_image_url TEXT,
  published_date TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);

CREATE TABLE IF NOT EXISTS sustainability_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  trips_count INTEGER DEFAULT 0,
  carbon_total_kg DECIMAL(12, 2),
  esg_score DECIMAL(5, 2),
  report_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- PART 4: SERVICE REQUESTS, DOCUMENTS, CURRENCY
-- =============================================================================
CREATE TABLE IF NOT EXISTS currency_exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR(10) NOT NULL,
  to_currency VARCHAR(10) NOT NULL,
  rate DECIMAL(12, 6) NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  destination VARCHAR(255),
  travel_date_from DATE,
  travel_date_to DATE,
  travelers_count INTEGER DEFAULT 1,
  budget_usd DECIMAL(12, 2),
  description TEXT,
  assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  submitted_at TIMESTAMPTZ,
  sla_due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);

CREATE TABLE IF NOT EXISTS request_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER,
  mime_type VARCHAR(50) DEFAULT 'application/pdf',
  status VARCHAR(50) DEFAULT 'pending',
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS request_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  status_stage VARCHAR(100) NOT NULL,
  description TEXT,
  percentage_complete INTEGER DEFAULT 0,
  notes TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  report_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER,
  generated_by UUID NOT NULL REFERENCES users(id),
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  last_downloaded TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  document_id UUID REFERENCES request_documents(id) ON DELETE CASCADE,
  report_id UUID REFERENCES service_reports(id) ON DELETE CASCADE,
  download_type VARCHAR(50),
  downloaded_at TIMESTAMPTZ DEFAULT now(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- =============================================================================
-- PART 5: CMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255),
  title_en VARCHAR(255),
  slug VARCHAR(100),
  status VARCHAR(50) DEFAULT 'published',
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cms_pages_page_key ON cms_pages(page_key);

CREATE TABLE IF NOT EXISTS cms_page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
  section_type VARCHAR(50),
  type VARCHAR(50),
  content_json JSONB DEFAULT '{}',
  content_en TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cms_page_sections_page_id ON cms_page_sections(page_id);

CREATE TABLE IF NOT EXISTS cms_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  title_en TEXT,
  title_rw TEXT,
  title_fr TEXT,
  slug TEXT,
  content_en TEXT,
  content_rw TEXT,
  content_fr TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cms_page_versions_page_key ON cms_page_versions(page_key);

CREATE TABLE IF NOT EXISTS cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- =============================================================================
-- PART 6: AUDIT, SESSIONS, ACCESS LOGS, WORKFLOW
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id TEXT,
  action VARCHAR(50) NOT NULL,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  tenant_id UUID,
  from_status VARCHAR(50),
  to_status VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  details JSONB DEFAULT '{}',
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  resource TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON access_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS workflow_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  tenant_id UUID,
  payload JSONB DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_workflow_events_type_created ON workflow_events(event_type, created_at);

-- =============================================================================
-- PART 7: PARTNERS (admin)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  external_id TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  partner_type TEXT NOT NULL,
  name TEXT NOT NULL,
  contact JSONB DEFAULT '{}',
  sla JSONB DEFAULT '{}',
  commission_percent DECIMAL(5, 2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Phase 7: integrations (optional columns on travel_requests already added above)
CREATE TABLE IF NOT EXISTS flight_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_request_id UUID REFERENCES travel_requests(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  external_id TEXT UNIQUE,
  pnr TEXT,
  e_ticket_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  search_snapshot JSONB,
  fare_rules JSONB,
  baggage_info JSONB,
  amount_usd DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  ticketed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_request_id UUID REFERENCES travel_requests(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  external_id TEXT,
  confirmation_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  property_snapshot JSONB,
  check_in DATE,
  check_out DATE,
  amount_usd DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS visa_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_country_iso TEXT NOT NULL,
  passport_nationality_iso TEXT NOT NULL,
  visa_required BOOLEAN NOT NULL DEFAULT true,
  lead_time_days INT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(destination_country_iso, passport_nationality_iso)
);
CREATE TABLE IF NOT EXISTS insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  travel_request_id UUID REFERENCES travel_requests(id),
  provider TEXT,
  policy_number TEXT,
  status TEXT DEFAULT 'active',
  coverage_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS risk_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  country_iso TEXT,
  risk_level TEXT,
  category TEXT,
  summary TEXT,
  payload JSONB,
  effective_from TIMESTAMPTZ DEFAULT now(),
  effective_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS traveler_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  travel_request_id UUID REFERENCES travel_requests(id),
  trip_id UUID REFERENCES trips(id),
  location_type TEXT,
  country_iso TEXT,
  city TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  reported_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB
);
CREATE TABLE IF NOT EXISTS duty_of_care_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  travel_request_id UUID REFERENCES travel_requests(id),
  status TEXT NOT NULL DEFAULT 'safe',
  message TEXT,
  checked_in_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS duty_of_care_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  title TEXT NOT NULL,
  body TEXT,
  severity TEXT DEFAULT 'info',
  affected_countries TEXT[],
  affected_request_ids UUID[],
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  operation TEXT NOT NULL,
  request_id TEXT,
  status TEXT,
  request_payload JSONB,
  response_summary JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  rate_limit_per_minute INT DEFAULT 60,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cost_center_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  internal_code TEXT NOT NULL,
  external_gl_code TEXT,
  erp_system TEXT,
  metadata JSONB,
  UNIQUE(company_id, internal_code, erp_system)
);
CREATE TABLE IF NOT EXISTS reconciliation_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  format TEXT DEFAULT 'csv',
  file_path TEXT,
  checksum TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- SEED: ROLES (no users)
-- =============================================================================
INSERT INTO roles (id, name, description, permissions, created_at)
VALUES
  (gen_random_uuid(), 'ADMIN', 'System administrator with full access', '["manage_users","manage_companies","view_analytics","manage_content"]'::jsonb, now()),
  (gen_random_uuid(), 'TRAVEL_AGENT', 'Travel agent managing client requests', '["manage_requests","view_requests","approve_requests","communicate_clients"]'::jsonb, now()),
  (gen_random_uuid(), 'CORPORATE_CLIENT', 'Corporate account manager', '["manage_employees","view_analytics","manage_policy","view_requests"]'::jsonb, now()),
  (gen_random_uuid(), 'CORPORATE_EMPLOYEE', 'Corporate employee', '["view_requests","create_requests","view_trips"]'::jsonb, now()),
  (gen_random_uuid(), 'INDIVIDUAL_TRAVELER', 'Individual traveler', '["view_packages","create_requests","manage_profile"]'::jsonb, now())
ON CONFLICT (name) DO UPDATE SET permissions = EXCLUDED.permissions, description = EXCLUDED.description;

-- =============================================================================
-- SEED: COMPANIES (only if empty)
-- =============================================================================
INSERT INTO companies (id, name, country, industry, created_at, updated_at)
SELECT gen_random_uuid(), 'TechCorp International', 'USA', 'Technology', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM companies LIMIT 1);
INSERT INTO companies (id, name, country, industry, created_at, updated_at)
SELECT gen_random_uuid(), 'Global Finance Ltd', 'United Kingdom', 'Financial Services', now(), now()
WHERE (SELECT count(*) FROM companies) < 2;
INSERT INTO companies (id, name, country, industry, created_at, updated_at)
SELECT gen_random_uuid(), 'Creative Solutions Inc', 'Australia', 'Creative Services', now(), now()
WHERE (SELECT count(*) FROM companies) < 3;

-- =============================================================================
-- SEED: DESTINATIONS (only if empty)
-- =============================================================================
INSERT INTO destinations (id, name, country, region, description, climate, best_season, currency, created_at, updated_at)
SELECT gen_random_uuid(), 'Rwanda', 'Rwanda', 'East Africa', 'Discover the land of a thousand hills with stunning landscapes and wildlife.', 'Tropical', 'Jun-Sep', 'RWF', now(), now()
WHERE (SELECT count(*) FROM destinations) < 1;
INSERT INTO destinations (id, name, country, region, description, climate, best_season, currency, created_at, updated_at)
SELECT gen_random_uuid(), 'Paris', 'France', 'Western Europe', 'Experience the City of Light with iconic landmarks and world-class culture.', 'Temperate', 'May-Sep', 'EUR', now(), now()
WHERE (SELECT count(*) FROM destinations) < 2;
INSERT INTO destinations (id, name, country, region, description, climate, best_season, currency, created_at, updated_at)
SELECT gen_random_uuid(), 'Maldives', 'Maldives', 'South Asia', 'Relax in the most exclusive tropical paradise with crystal-clear waters.', 'Tropical', 'Nov-Apr', 'MVR', now(), now()
WHERE (SELECT count(*) FROM destinations) < 3;
INSERT INTO destinations (id, name, country, region, description, climate, best_season, currency, created_at, updated_at)
SELECT gen_random_uuid(), 'Tanzania', 'Tanzania', 'East Africa', 'Witness the great migration and explore pristine natural beauty.', 'Subtropical', 'Jun-Oct', 'TZS', now(), now()
WHERE (SELECT count(*) FROM destinations) < 4;
INSERT INTO destinations (id, name, country, region, description, climate, best_season, currency, created_at, updated_at)
SELECT gen_random_uuid(), 'Costa Rica', 'Costa Rica', 'Central America', 'Explore biodiversity hotspot with adventure and eco-tourism.', 'Tropical', 'Dec-Apr', 'CRC', now(), now()
WHERE (SELECT count(*) FROM destinations) < 5;
INSERT INTO destinations (id, name, country, region, description, climate, best_season, currency, created_at, updated_at)
SELECT gen_random_uuid(), 'Japan', 'Japan', 'East Asia', 'Experience tradition and modernity in the land of the rising sun.', 'Temperate', 'Mar-May', 'JPY', now(), now()
WHERE (SELECT count(*) FROM destinations) < 6;

-- =============================================================================
-- SEED: PACKAGES (travel_packages view will expose these; only if empty)
-- =============================================================================
INSERT INTO packages (id, title_en, title, description_en, description, duration, duration_days, price_usd, price_rwf, status, order_index, created_at, updated_at)
SELECT gen_random_uuid(), 'Dubai Holiday', 'Dubai Holiday', 'Experience luxury in Dubai', 'Experience luxury in Dubai', '5 Days', 5, 2500, 3250000, 'active', 1, now(), now()
WHERE (SELECT count(*) FROM packages) < 1;
INSERT INTO packages (id, title_en, title, description_en, description, duration, duration_days, price_usd, price_rwf, status, order_index, created_at, updated_at)
SELECT gen_random_uuid(), 'European Cities', 'European Cities', 'Discover the charm of Paris, Rome, and Barcelona', 'Discover the charm of Paris, Rome, and Barcelona', '10 Days', 10, 5000, 6500000, 'active', 2, now(), now()
WHERE (SELECT count(*) FROM packages) < 2;
INSERT INTO packages (id, title_en, title, description_en, description, duration, duration_days, price_usd, price_rwf, status, order_index, created_at, updated_at)
SELECT gen_random_uuid(), 'Family Safari', 'Family Safari', 'Create unforgettable memories with wildlife safari', 'Create unforgettable memories with wildlife safari', '7 Days', 7, 3500, 4550000, 'active', 3, now(), now()
WHERE (SELECT count(*) FROM packages) < 3;

-- =============================================================================
-- SEED: SITE SETTINGS
-- =============================================================================
INSERT INTO site_settings (key, value, type, description)
VALUES
  ('site_name', 'We of You Travel', 'string', 'Site name displayed in header'),
  ('site_description', 'Corporate Travel Management Platform', 'string', 'Site description for SEO'),
  ('contact_email', 'info@weofyou.travel', 'string', 'Contact email'),
  ('support_phone', '+1-555-0123', 'string', 'Support phone number'),
  ('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
  ('max_upload_size', '10485760', 'number', 'Max file upload size in bytes (10MB)')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- SEED: CMS PAGES (home + legal page keys)
-- =============================================================================
INSERT INTO cms_pages (id, page_key, title_en, title, slug, status, seo_title, seo_description, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'home', 'Home', 'Home', 'home', 'published', 'We of You Travel', 'Corporate Travel Management', now(), now()),
  (gen_random_uuid(), 'about', 'About Us', 'About Us', 'about', 'published', 'About Us', 'About our company', now(), now()),
  (gen_random_uuid(), 'privacy-policy', 'Privacy Policy', 'Privacy Policy', 'privacy-policy', 'published', 'Privacy Policy', 'Privacy Policy', now(), now()),
  (gen_random_uuid(), 'terms-and-conditions', 'Terms & Conditions', 'Terms & Conditions', 'terms-and-conditions', 'published', 'Terms & Conditions', 'Terms and Conditions', now(), now()),
  (gen_random_uuid(), 'travel-liability-disclaimer', 'Travel Liability Disclaimer', 'Travel Liability Disclaimer', 'travel-liability-disclaimer', 'published', 'Travel Liability Disclaimer', 'Travel Liability Disclaimer', now(), now()),
  (gen_random_uuid(), 'data-protection-notice', 'Data Protection Notice', 'Data Protection Notice', 'data-protection-notice', 'published', 'Data Protection Notice', 'Data Protection Notice', now(), now()),
  (gen_random_uuid(), 'cookies-policy', 'Cookies Policy', 'Cookies Policy', 'cookies-policy', 'published', 'Cookies Policy', 'Cookies Policy', now(), now()),
  (gen_random_uuid(), 'corporate-travel-policy-template', 'Corporate Travel Policy Template', 'Corporate Travel Policy Template', 'corporate-travel-policy-template', 'published', 'Corporate Travel Policy Template', 'Corporate Travel Policy Template', now(), now()),
  (gen_random_uuid(), 'government-regulatory-notice', 'Government & Regulatory Notice', 'Government & Regulatory Notice', 'government-regulatory-notice', 'published', 'Government & Regulatory Notice', 'Government & Regulatory Notice', now(), now())
ON CONFLICT (page_key) DO UPDATE SET title_en = EXCLUDED.title_en, slug = EXCLUDED.slug, status = EXCLUDED.status, updated_at = now();

-- =============================================================================
-- SEED: CMS PAGE VERSIONS (one published version for home so [slug] page works)
-- =============================================================================
INSERT INTO cms_page_versions (page_key, title_en, slug, content_en, seo_title, seo_description, is_published, published_at, created_at)
SELECT 'home', 'Home', 'home', 'Welcome to We of You Travel.', 'We of You Travel', 'Corporate Travel Management', true, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM cms_page_versions WHERE page_key = 'home' AND is_published = true);

-- =============================================================================
-- DONE
-- =============================================================================
-- Users table is empty. Add users via Supabase Authentication or:
--   INSERT INTO users (email, password_hash, full_name, role, company_id) VALUES (...);
-- Then link companies to users: UPDATE companies SET admin_user_id = '<user_uuid>' WHERE name = '...';
