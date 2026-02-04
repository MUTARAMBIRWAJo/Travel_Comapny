-- Create tables for We-Of-You Travel & Experiences Ltd

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'traveler',
  preferred_language VARCHAR(10) DEFAULT 'en',
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
  category VARCHAR(100) NOT NULL,
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
  type VARCHAR(50) NOT NULL,
  destination_id UUID REFERENCES destinations(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending',
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
  status VARCHAR(50) DEFAULT 'planning',
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
  status VARCHAR(50) DEFAULT 'pending',
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
  type VARCHAR(50) NOT NULL,
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
  language VARCHAR(10),
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

-- CMS TABLES FOR DYNAMIC CONTENT MANAGEMENT

-- Global Settings table
CREATE TABLE IF NOT EXISTS cms_global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value_en TEXT,
  value_rw TEXT,
  value_fr TEXT,
  type VARCHAR(50) DEFAULT 'text',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pages table
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key VARCHAR(100) UNIQUE NOT NULL,
  title_en VARCHAR(255),
  title_rw VARCHAR(255),
  title_fr VARCHAR(255),
  slug VARCHAR(100),
  status VARCHAR(50) DEFAULT 'published',
  seo_title_en VARCHAR(255),
  seo_title_rw VARCHAR(255),
  seo_title_fr VARCHAR(255),
  seo_description_en TEXT,
  seo_description_rw TEXT,
  seo_description_fr TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Page Sections table
CREATE TABLE IF NOT EXISTS cms_page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
  section_type VARCHAR(50),
  title_en VARCHAR(255),
  title_rw VARCHAR(255),
  title_fr VARCHAR(255),
  content_en TEXT,
  content_rw TEXT,
  content_fr TEXT,
  image_url TEXT,
  image_alt_en VARCHAR(255),
  image_alt_rw VARCHAR(255),
  image_alt_fr VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services table (extends existing services)
CREATE TABLE IF NOT EXISTS cms_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en VARCHAR(255) NOT NULL,
  title_rw VARCHAR(255),
  title_fr VARCHAR(255),
  slug VARCHAR(100),
  short_description_en TEXT,
  short_description_rw TEXT,
  short_description_fr TEXT,
  full_description_en TEXT,
  full_description_rw TEXT,
  full_description_fr TEXT,
  icon VARCHAR(100),
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  order_index INTEGER DEFAULT 0,
  seo_title_en VARCHAR(255),
  seo_title_rw VARCHAR(255),
  seo_title_fr VARCHAR(255),
  seo_description_en TEXT,
  seo_description_rw TEXT,
  seo_description_fr TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Destinations CMS
CREATE TABLE IF NOT EXISTS cms_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(255) NOT NULL,
  name_rw VARCHAR(255),
  name_fr VARCHAR(255),
  visa_info_en TEXT,
  visa_info_rw TEXT,
  visa_info_fr TEXT,
  cultural_tips_en TEXT,
  cultural_tips_rw TEXT,
  cultural_tips_fr TEXT,
  flight_routes TEXT,
  safety_notes_en TEXT,
  safety_notes_rw TEXT,
  safety_notes_fr TEXT,
  food_notes_en TEXT,
  food_notes_rw TEXT,
  food_notes_fr TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS cms_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_title VARCHAR(100),
  customer_location VARCHAR(255),
  message_en TEXT NOT NULL,
  message_rw TEXT,
  message_fr TEXT,
  photo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS Packages
CREATE TABLE IF NOT EXISTS cms_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en VARCHAR(255) NOT NULL,
  title_rw VARCHAR(255),
  title_fr VARCHAR(255),
  duration VARCHAR(100),
  includes_en TEXT,
  includes_rw TEXT,
  includes_fr TEXT,
  price_rwf DECIMAL(12, 2),
  price_usd DECIMAL(12, 2),
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQs
CREATE TABLE IF NOT EXISTS cms_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en TEXT NOT NULL,
  question_rw TEXT,
  question_fr TEXT,
  answer_en TEXT NOT NULL,
  answer_rw TEXT,
  answer_fr TEXT,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX idx_cms_pages_page_key ON cms_pages(page_key);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
CREATE INDEX idx_cms_page_sections_page_id ON cms_page_sections(page_id);
CREATE INDEX idx_cms_services_slug ON cms_services(slug);
CREATE INDEX idx_cms_services_status ON cms_services(status);
CREATE INDEX idx_cms_destinations_status ON cms_destinations(status);
CREATE INDEX idx_cms_testimonials_featured ON cms_testimonials(is_featured);
CREATE INDEX idx_cms_packages_status ON cms_packages(status);
CREATE INDEX idx_cms_faqs_category ON cms_faqs(category);
