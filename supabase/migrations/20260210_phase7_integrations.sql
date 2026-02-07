-- Phase 7: External integrations — flights, hotels, visa, insurance, duty of care, API platform, financial.
-- Safe: CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS.

-- Flight bookings (unified format; PNR, e-ticket from GDS/airline)
CREATE TABLE IF NOT EXISTS flight_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_request_id uuid REFERENCES travel_requests(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  provider text NOT NULL, -- amadeus, rwandair_direct, mock
  external_id text UNIQUE, -- idempotency / provider reference
  pnr text,
  e_ticket_number text,
  status text NOT NULL DEFAULT 'pending', -- pending, price_locked, approved, ticketed, cancelled, refunded
  search_snapshot jsonb, -- offer at time of lock
  fare_rules jsonb,
  baggage_info jsonb,
  amount_usd decimal(12,2),
  currency text DEFAULT 'USD',
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  ticketed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_flight_bookings_travel_request ON flight_bookings(travel_request_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_external_id ON flight_bookings(external_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON flight_bookings(status);

-- Hotel bookings
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_request_id uuid REFERENCES travel_requests(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  provider text NOT NULL,
  external_id text,
  confirmation_code text,
  status text NOT NULL DEFAULT 'pending',
  property_snapshot jsonb,
  check_in date,
  check_out date,
  amount_usd decimal(12,2),
  currency text DEFAULT 'USD',
  invoice_id uuid REFERENCES invoices(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hotel_bookings_travel_request ON hotel_bookings(travel_request_id);

-- Visa & immigration: destination rules and lead-time
CREATE TABLE IF NOT EXISTS visa_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_country_iso text NOT NULL,
  passport_nationality_iso text NOT NULL,
  visa_required boolean NOT NULL DEFAULT true,
  lead_time_days int,
  notes text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(destination_country_iso, passport_nationality_iso)
);

CREATE INDEX IF NOT EXISTS idx_visa_requirements_dest_nat ON visa_requirements(destination_country_iso, passport_nationality_iso);

-- Insurance policies (per trip or company)
CREATE TABLE IF NOT EXISTS insurance_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  travel_request_id uuid REFERENCES travel_requests(id),
  provider text,
  policy_number text,
  status text DEFAULT 'active',
  coverage_snapshot jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Risk feeds (country risk, health, political)
CREATE TABLE IF NOT EXISTS risk_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  country_iso text,
  risk_level text,
  category text, -- health, political, security
  summary text,
  payload jsonb,
  effective_from timestamptz DEFAULT now(),
  effective_to timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_risk_feeds_country ON risk_feeds(country_iso);
CREATE INDEX IF NOT EXISTS idx_risk_feeds_effective ON risk_feeds(effective_from, effective_to);

-- Duty of care: traveler location / check-in
CREATE TABLE IF NOT EXISTS traveler_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  travel_request_id uuid REFERENCES travel_requests(id),
  trip_id uuid REFERENCES trips(id),
  location_type text, -- manual, api, check_in
  country_iso text,
  city text,
  lat decimal(10,7),
  lng decimal(10,7),
  reported_at timestamptz DEFAULT now(),
  metadata jsonb
);

CREATE INDEX IF NOT EXISTS idx_traveler_locations_user ON traveler_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_traveler_locations_reported ON traveler_locations(reported_at DESC);

CREATE TABLE IF NOT EXISTS duty_of_care_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  travel_request_id uuid REFERENCES travel_requests(id),
  status text NOT NULL DEFAULT 'safe', -- safe, delayed, incident
  message text,
  checked_in_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS duty_of_care_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  title text NOT NULL,
  body text,
  severity text DEFAULT 'info', -- info, warning, critical
  affected_countries text[],
  affected_request_ids uuid[],
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Integration log (all external API calls for audit)
CREATE TABLE IF NOT EXISTS integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  operation text NOT NULL,
  request_id text,
  status text, -- success, failure, timeout
  request_payload jsonb,
  response_summary jsonb,
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integration_logs_provider_created ON integration_logs(provider, created_at DESC);

-- Public API keys (tenant-aware)
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE, -- hash of the secret key
  key_prefix text NOT NULL, -- first 8 chars for identification
  scopes text[] DEFAULT '{}',
  rate_limit_per_minute int DEFAULT 60,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);

-- Cost center / GL mapping (ERP integration)
CREATE TABLE IF NOT EXISTS cost_center_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  internal_code text NOT NULL,
  external_gl_code text,
  erp_system text, -- sap, oracle, quickbooks
  metadata jsonb,
  UNIQUE(company_id, internal_code, erp_system)
);

-- Reconciliation export batches (audit-ready)
CREATE TABLE IF NOT EXISTS reconciliation_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  period_start date NOT NULL,
  period_end date NOT NULL,
  format text DEFAULT 'csv', -- csv, json
  file_path text,
  checksum text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Optional: ensure travel_requests has destination text (app may use it)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travel_requests') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travel_requests' AND column_name = 'destination') THEN
      ALTER TABLE travel_requests ADD COLUMN destination VARCHAR(255);
    END IF;
  END IF;
END $$;

COMMENT ON TABLE flight_bookings IS 'Phase 7: Unified flight bookings from GDS/direct airline; idempotent by external_id';
COMMENT ON TABLE integration_logs IS 'Phase 7: Audit log for all external API calls';
