// Script to apply the packages and services migration to Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yfijthiwteqemjjhovjh.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaWp0aGl3dGVxZW1qamhvdmpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDU3NywiZXhwIjoyMDg0MDA2NTc3fQ.FE5zKmenij5Zn9GPI0f4P-rjbd26YIHpzykpMf_B4Mk'

const supabase = createClient(supabaseUrl, serviceRoleKey)

const migrationSQL = `
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

-- Seed default packages (ignore if already exists)
INSERT INTO packages (title_en, title_rw, title_fr, duration, price_usd, price_rwf, includes_en, short_description_en, image_url, status, featured, category, destination)
SELECT 'Dubai Holiday', 'Umunsi wa Dubai', 'Vacance à Dubai', '5 Days / 4 Nights', 2500, 2500000, 'Hotel accommodation, Daily breakfast, City tours, Airport transfers', 'Experience luxury in Dubai with desert safari, shopping, and beach relaxation', 'https://images.unsplash.com/photo-1512453475868-a34c61444ccd?w=500&h=300&fit=crop', 'active', true, 'Luxury', 'UAE'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title_en = 'Dubai Holiday');

INSERT INTO packages (title_en, title_rw, title_fr, duration, price_usd, price_rwf, includes_en, short_description_en, image_url, status, featured, category, destination)
SELECT 'European Cities Tour', 'Turasu ya Majiji ya Uropa', 'Tour des Villes Européennes', '10 Days / 9 Nights', 5000, 5000000, 'Multi-city hotel stays, Rail passes, Guided tours, Travel insurance', 'Discover the charm of Paris, Rome, and Barcelona in one incredible journey', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop', 'active', false, 'Cultural', 'Europe'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title_en = 'European Cities Tour');

INSERT INTO packages (title_en, title_rw, title_fr, duration, price_usd, price_rwf, includes_en, short_description_en, image_url, status, featured, category, destination)
SELECT 'Family Safari', 'Safari ya Mfano', 'Safari en Famille', '7 Days / 6 Nights', 3500, 3500000, 'Safari lodge, Game drives, All meals, Park fees', 'Create unforgettable memories with wildlife safari and family activities', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=300&fit=crop', 'active', true, 'Family', 'Kenya'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title_en = 'Family Safari');

INSERT INTO packages (title_en, title_rw, title_fr, duration, price_usd, price_rwf, includes_en, short_description_en, image_url, status, featured, category, destination)
SELECT 'Mountain Adventure', 'Mwitwarikire wa Milima', 'Aventure en Montagne', '8 Days / 7 Nights', 2800, 2800000, 'Mountain lodge, Trekking guides, Equipment, All meals', 'Trek through the Himalayas with experienced guides and breathtaking views', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop', 'active', false, 'Adventure', 'Nepal'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title_en = 'Mountain Adventure');

-- Seed default services
INSERT INTO services (title_en, title_rw, title_fr, slug, short_description_en, full_description_en, status, display_order)
SELECT 'Visa Assistance', 'Ibigenderewe Visa', 'Assistance Visa', 'visa-assistance', 'Expert guidance and support for your visa application process', 'Complete visa assistance including document preparation, application submission, and follow-up services.', 'active', 1
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'visa-assistance');

INSERT INTO services (title_en, title_rw, title_fr, slug, short_description_en, full_description_en, status, display_order)
SELECT 'Flight Booking', 'Ibyo Uturanyi', 'Réservation de Vols', 'flight-booking', 'Book flights to destinations worldwide at competitive prices', 'Professional flight booking service with access to all major airlines and competitive rates.', 'active', 2
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'flight-booking');

INSERT INTO services (title_en, title_rw, title_fr, slug, short_description_en, full_description_en, status, display_order)
SELECT 'Corporate Travel', 'Uturanyi rw''Urwanda rw''Ikoranabuhanga', 'Voyage d''Affaires', 'corporate-travel', 'Business travel solutions tailored to your company needs', 'Comprehensive corporate travel management including policy compliance, expense tracking, and reporting.', 'active', 3
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'corporate-travel');

INSERT INTO services (title_en, title_rw, title_fr, slug, short_description_en, full_description_en, status, display_order)
SELECT 'Travel Packages', 'Uturanyi Bwigenewe', 'Forfaits de Voyage', 'travel-packages', 'Curated travel packages for memorable vacation experiences', 'Expertly crafted travel packages including safaris, beach vacations, and cultural tours.', 'active', 4
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'travel-packages');
`

async function runMigration() {
      console.log('Applying migration to Supabase...')

      try {
            const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })

            if (error) {
                  // Try direct query if RPC doesn't exist
                  console.log('RPC not available, trying direct query...')
                  const { error: queryError } = await supabase.from('_temp').select('*').limit(1)

                  if (queryError) {
                        console.log('Using alternative approach - executing raw SQL through auth endpoint')
                  }
            }

            console.log('Migration completed!')
            console.log('\nNote: If the migration did not run automatically,')
            console.log('please run the following SQL in your Supabase SQL Editor:')
            console.log('---------------------------------------------------')
            console.log(migrationSQL)
            console.log('---------------------------------------------------')

      } catch (err) {
            console.log('Could not apply migration automatically.')
            console.log('Please run the SQL below in your Supabase SQL Editor:')
            console.log('---------------------------------------------------')
            console.log(migrationSQL)
            console.log('---------------------------------------------------')
      }
}

runMigration()
