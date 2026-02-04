-- Create packages table with all required columns
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_order ON public.packages(order_index);

-- Insert sample data
INSERT INTO public.packages (title_en, description_en, duration, price_usd, price_rwf, status, order_index)
VALUES 
  ('Dubai Holiday', 'Experience luxury in Dubai', '5 Days', 2500, 3250000, 'active', 1),
  ('European Cities', 'Discover the charm of Paris, Rome, and Barcelona', '10 Days', 5000, 6500000, 'active', 2),
  ('Family Safari', 'Create unforgettable memories with wildlife safari', '7 Days', 3500, 4550000, 'active', 3)
ON CONFLICT DO NOTHING;
