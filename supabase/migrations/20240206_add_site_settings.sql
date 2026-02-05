CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- Insert some default settings
INSERT INTO public.site_settings (key, value, type, description) VALUES
('site_name', 'We of You Travel', 'string', 'Site name displayed in header'),
('site_description', 'Corporate Travel Management Platform', 'string', 'Site description for SEO'),
('contact_email', 'info@weofyou.travel', 'string', 'Contact email'),
('support_phone', '+1-555-0123', 'string', 'Support phone number'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('max_upload_size', '10485760', 'number', 'Max file upload size in bytes (10MB)')
ON CONFLICT (key) DO NOTHING;