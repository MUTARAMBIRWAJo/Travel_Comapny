-- Migration: Add packages and services tables (with correct schema)
-- Run this to recreate tables with all required columns

-- Drop existing tables if they exist
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- Packages table for travel packages
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_rw text,
  title_fr text,
  duration text NOT NULL,
  price_usd numeric(10,2) NOT NULL DEFAULT 0,
  price_rwf numeric(12,2) NOT NULL DEFAULT 0,
  includes_en text,
  short_description_en text,
  image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  featured boolean DEFAULT false,
  category text DEFAULT 'Travel Package',
  destination text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table for service offerings
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_rw text,
  title_fr text,
  slug text UNIQUE NOT NULL,
  short_description_en text,
  full_description_en text,
  icon text,
  image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed default packages
INSERT INTO packages (title_en, title_rw, title_fr, duration, price_usd, price_rwf, includes_en, short_description_en, image_url, status, featured, category, destination)
VALUES 
  ('Dubai Holiday', 'Umunsi wa Dubai', 'Vacance à Dubai', '5 Days / 4 Nights', 2500, 2500000, 'Hotel accommodation, Daily breakfast, City tours, Airport transfers', 'Experience luxury in Dubai with desert safari, shopping, and beach relaxation', 'https://images.unsplash.com/photo-1512453475868-a34c61444ccd?w=500&h=300&fit=crop', 'active', true, 'Luxury', 'UAE'),
  ('European Cities Tour', 'Turasu ya Majiji ya Uropa', 'Tour des Villes Européennes', '10 Days / 9 Nights', 5000, 5000000, 'Multi-city hotel stays, Rail passes, Guided tours, Travel insurance', 'Discover the charm of Paris, Rome, and Barcelona in one incredible journey', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop', 'active', false, 'Cultural', 'Europe'),
  ('Family Safari', 'Safari ya Mfano', 'Safari en Famille', '7 Days / 6 Nights', 3500, 3500000, 'Safari lodge, Game drives, All meals, Park fees', 'Create unforgettable memories with wildlife safari and family activities', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=300&fit=crop', 'active', true, 'Family', 'Kenya'),
  ('Mountain Adventure', 'Mwitwarikire wa Milima', 'Aventure en Montagne', '8 Days / 7 Nights', 2800, 2800000, 'Mountain lodge, Trekking guides, Equipment, All meals', 'Trek through the Himalayas with experienced guides and breathtaking views', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop', 'active', false, 'Adventure', 'Nepal');

-- Seed default services
INSERT INTO services (title_en, title_rw, title_fr, slug, short_description_en, full_description_en, status, display_order)
VALUES 
  ('Visa Assistance', 'Ibigenderewe Visa', 'Assistance Visa', 'visa-assistance', 'Expert guidance and support for your visa application process', 'Complete visa assistance including document preparation, application submission, and follow-up services.', 'active', 1),
  ('Flight Booking', 'Ibyo Uturanyi', 'Réservation de Vols', 'flight-booking', 'Book flights to destinations worldwide at competitive prices', 'Professional flight booking service with access to all major airlines and competitive rates.', 'active', 2),
  ('Corporate Travel', 'Uturanyi rw''Urwanda rw''Ikoranabuhanga', 'Voyage d''Affaires', 'corporate-travel', 'Business travel solutions tailored to your company needs', 'Comprehensive corporate travel management including policy compliance, expense tracking, and reporting.', 'active', 3),
  ('Travel Packages', 'Uturanyi Bwigenewe', 'Forfaits de Voyage', 'travel-packages', 'Curated travel packages for memorable vacation experiences', 'Expertly crafted travel packages including safaris, beach vacations, and cultural tours.', 'active', 4);
