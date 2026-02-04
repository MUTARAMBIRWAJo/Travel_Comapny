-- Create tables for We-Of-You Travel & Experiences Ltd

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'traveler', -- guest, traveler, corporate_client, corporate_employee, travel_agent, admin
  preferred_language VARCHAR(10) DEFAULT 'en', -- en, fr, kin
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  company_id UUID,
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT true
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  industry VARCHAR(100),
  travel_budget DECIMAL(15, 2),
  esg_settings JSONB DEFAULT '{"tracking_enabled": false, "carbon_offset": false}',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Destinations table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Travel Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- leisure, corporate, adventure, cultural
  description TEXT,
  price_usd DECIMAL(12, 2) NOT NULL,
  duration_days INTEGER,
  destination_id UUID REFERENCES destinations(id),
  itinerary JSONB,
  image_url TEXT,
  amenities JSONB DEFAULT '[]',
  max_travelers INTEGER,
  available_from DATE,
  available_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Travel Requests table
CREATE TABLE IF NOT EXISTS travel_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  type VARCHAR(50) NOT NULL, -- leisure, business, conference
  destination_id UUID REFERENCES destinations(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, booked, completed
  assigned_agent_id UUID REFERENCES users(id),
  budget_usd DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES travel_requests(id),
  user_id UUID REFERENCES users(id),
  itinerary JSONB,
  status VARCHAR(50) DEFAULT 'planning', -- planning, booked, ongoing, completed
  carbon_footprint_kg DECIMAL(10, 2),
  total_cost_usd DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  pdf_path TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
  issued_date DATE,
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- email, sms, in_app
  content TEXT NOT NULL,
  title VARCHAR(255),
  read_status BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  language VARCHAR(10), -- en, fr, kin
  category VARCHAR(100),
  featured_image_url TEXT,
  published_date TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sustainability Reports table
CREATE TABLE IF NOT EXISTS sustainability_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  trips_count INTEGER DEFAULT 0,
  carbon_total_kg DECIMAL(12, 2),
  esg_score DECIMAL(5, 2),
  report_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_travel_requests_user_id ON travel_requests(user_id);
CREATE INDEX idx_travel_requests_status ON travel_requests(status);
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_invoices_trip_id ON invoices(trip_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_blog_posts_language ON blog_posts(language);
