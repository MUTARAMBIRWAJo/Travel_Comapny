-- Add missing columns to packages table if they don't exist
ALTER TABLE IF EXISTS public.packages ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE IF EXISTS public.packages ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS public.packages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE IF EXISTS public.packages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_order ON public.packages(order_index);

-- Insert sample data (will skip if it already exists due to unique constraint)
INSERT INTO public.packages (title_en, description_en, duration, price_usd, price_rwf, status, order_index)
VALUES 
  ('Dubai Holiday', 'Experience luxury in Dubai', '5 Days', 2500, 3250000, 'active', 1),
  ('European Cities', 'Discover the charm of Paris, Rome, and Barcelona', '10 Days', 5000, 6500000, 'active', 2),
  ('Family Safari', 'Create unforgettable memories with wildlife safari', '7 Days', 3500, 4550000, 'active', 3)
ON CONFLICT DO NOTHING;
