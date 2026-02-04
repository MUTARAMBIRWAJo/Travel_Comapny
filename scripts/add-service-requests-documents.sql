-- Add new features: Service Requests, Documents, Currency Management

-- Currency Exchange Rates Management
CREATE TABLE IF NOT EXISTS currency_exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR(10) NOT NULL,
  to_currency VARCHAR(10) NOT NULL,
  rate DECIMAL(12, 6) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_currency, to_currency)
);

-- Service Requests (extending travel requests functionality)
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL, -- 'visa', 'flight', 'hotel', 'transport', 'tour', 'document_processing'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected', 'completed'
  destination VARCHAR(255),
  travel_date_from DATE,
  travel_date_to DATE,
  travelers_count INTEGER DEFAULT 1,
  budget_usd DECIMAL(12, 2),
  description TEXT,
  assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document Management for Service Requests
CREATE TABLE IF NOT EXISTS request_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- 'passport', 'visa', 'birth_certificate', 'bank_statement', 'insurance', 'other'
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL, -- path in storage
  file_size_bytes INTEGER,
  mime_type VARCHAR(50) DEFAULT 'application/pdf',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Request Status and Progress Tracking
CREATE TABLE IF NOT EXISTS request_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  status_stage VARCHAR(100) NOT NULL, -- 'submitted', 'under_review', 'documents_verified', 'processing', 'completed'
  description TEXT,
  percentage_complete INTEGER DEFAULT 0,
  notes TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Generated Reports/Results (PDFs for travelers)
CREATE TABLE IF NOT EXISTS service_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  report_type VARCHAR(100) NOT NULL, -- 'visa_approval', 'booking_confirmation', 'itinerary', 'final_summary'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER,
  generated_by UUID NOT NULL REFERENCES users(id),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  last_downloaded TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document downloads audit trail
CREATE TABLE IF NOT EXISTS document_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  document_id UUID REFERENCES request_documents(id) ON DELETE CASCADE,
  report_id UUID REFERENCES service_reports(id) ON DELETE CASCADE,
  download_type VARCHAR(50), -- 'document', 'report'
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned_agent ON service_requests(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_request_documents_service_request ON request_documents(service_request_id);
CREATE INDEX IF NOT EXISTS idx_request_documents_status ON request_documents(status);
CREATE INDEX IF NOT EXISTS idx_request_progress_service_request ON request_progress(service_request_id);
CREATE INDEX IF NOT EXISTS idx_service_reports_service_request ON service_reports(service_request_id);
CREATE INDEX IF NOT EXISTS idx_currency_exchange_rates ON currency_exchange_rates(from_currency, to_currency);

-- Enable Row Level Security if needed (optional, depending on auth setup)
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_exchange_rates ENABLE ROW LEVEL SECURITY;
