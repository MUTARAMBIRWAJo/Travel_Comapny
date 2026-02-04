-- Fix Database Schema Inconsistencies
-- This migration ensures the packages table has all required columns
-- and sets up proper constraints, indexes, and RLS policies

-- 1. Ensure packages table exists with proper structure
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en VARCHAR(255),
  title_rw VARCHAR(255),
  title_fr VARCHAR(255),
  description_en TEXT,
  description_rw TEXT,
  description_fr TEXT,
  includes_en TEXT,
  includes_rw TEXT,
  includes_fr TEXT,
  duration VARCHAR(100),
  price_usd DECIMAL(10,2),
  price_rwf DECIMAL(15,2),
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add missing columns to packages if they don't exist
ALTER TABLE IF EXISTS public.packages 
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_rw VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_rw TEXT,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS includes_en TEXT,
ADD COLUMN IF NOT EXISTS includes_rw TEXT,
ADD COLUMN IF NOT EXISTS includes_fr TEXT,
ADD COLUMN IF NOT EXISTS duration VARCHAR(100),
ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_rwf DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_order ON public.packages(order_index);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON public.packages(created_at);

-- 4. Enable Row Level Security
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policy for public read access to active packages
CREATE POLICY IF NOT EXISTS "Enable read access for active packages" ON public.packages
FOR SELECT USING (status = 'active');

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for automatic updated_at
DROP TRIGGER IF EXISTS update_packages_updated_at ON public.packages;
CREATE TRIGGER update_packages_updated_at 
BEFORE UPDATE ON public.packages 
FOR EACH ROW EXECUTE FUNCTION update_packages_updated_at();

-- 8. Insert sample data if table is empty
INSERT INTO public.packages (title_en, description_en, duration, price_usd, price_rwf, status, order_index)
VALUES 
  ('Dubai Holiday', 'Experience luxury in Dubai', '5 Days', 2500, 3250000, 'active', 1),
  ('European Cities', 'Discover the charm of Paris, Rome, and Barcelona', '10 Days', 5000, 6500000, 'active', 2),
  ('Family Safari', 'Create unforgettable memories with wildlife safari', '7 Days', 3500, 4550000, 'active', 3)
ON CONFLICT DO NOTHING;
