-- SAFE migration: Check existing tables first, then create only what's missing
-- This prevents errors if run multiple times

-- 1. First, check what tables actually exist
DO $$
DECLARE
    table_exists boolean;
BEGIN
    -- Check if packages table exists
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'packages'
    ) INTO table_exists;
    
    -- If packages exists but cms_packages doesn't, rename it
    IF table_exists AND NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'cms_packages'
    ) THEN
        ALTER TABLE public.packages RENAME TO cms_packages;
        RAISE NOTICE 'Renamed "packages" to "cms_packages"';
    END IF;
END $$;

-- 2. Create cms_packages if it doesn't exist (safe approach)
CREATE TABLE IF NOT EXISTS public.cms_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    order_index INTEGER DEFAULT 0,
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Check for services/invoices table
DO $$
DECLARE
    services_exists boolean;
    invoices_exists boolean;
BEGIN
    -- Check for services table
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'services'
    ) INTO services_exists;
    
    -- Check for invoices table (from the hint)
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'invoices'
    ) INTO invoices_exists;
    
    -- Create cms_services table
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'cms_services'
    ) THEN
        CREATE TABLE public.cms_services (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255),
            description TEXT,
            status VARCHAR(20) DEFAULT 'active',
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created "cms_services" table';
    END IF;
END $$;

-- 4. Create indexes safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'cms_packages' 
        AND indexname = 'idx_cms_packages_status'
    ) THEN
        CREATE INDEX idx_cms_packages_status ON public.cms_packages(status, order_index);
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'cms_services' 
        AND indexname = 'idx_cms_services_status'
    ) THEN
        CREATE INDEX idx_cms_services_status ON public.cms_services(status, order_index);
    END IF;
END $$;