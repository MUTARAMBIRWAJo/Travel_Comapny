-- Admin & CMS layer: add columns required for user status, org settings, and section JSON.
-- Safe: ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS.

-- Users: status for suspend/activate (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
    RAISE NOTICE 'Added users.status';
  END IF;
END $$;

-- Companies (organizations): billing_email, settings, admin_user_id for org admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'billing_email') THEN
    ALTER TABLE public.companies ADD COLUMN billing_email VARCHAR(255);
    RAISE NOTICE 'Added companies.billing_email';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'settings') THEN
    ALTER TABLE public.companies ADD COLUMN settings JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added companies.settings';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'admin_user_id') THEN
    ALTER TABLE public.companies ADD COLUMN admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added companies.admin_user_id';
  END IF;
END $$;

-- cms_page_sections: content_json for structured section content (admin editor uses type + content_json)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cms_page_sections' AND column_name = 'content_json') THEN
    ALTER TABLE public.cms_page_sections ADD COLUMN content_json JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added cms_page_sections.content_json';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cms_page_sections' AND column_name = 'type') THEN
    ALTER TABLE public.cms_page_sections ADD COLUMN type VARCHAR(50);
    RAISE NOTICE 'Added cms_page_sections.type';
  END IF;
END $$;

-- cms_pages: ensure slug and status exist (some schemas use page_key only)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cms_pages' AND column_name = 'slug') THEN
    ALTER TABLE public.cms_pages ADD COLUMN slug VARCHAR(100);
    RAISE NOTICE 'Added cms_pages.slug';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cms_pages' AND column_name = 'title') THEN
    ALTER TABLE public.cms_pages ADD COLUMN title VARCHAR(255);
    RAISE NOTICE 'Added cms_pages.title';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cms_pages' AND column_name = 'seo_title') THEN
    ALTER TABLE public.cms_pages ADD COLUMN seo_title VARCHAR(255);
    RAISE NOTICE 'Added cms_pages.seo_title';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cms_pages' AND column_name = 'seo_description') THEN
    ALTER TABLE public.cms_pages ADD COLUMN seo_description TEXT;
    RAISE NOTICE 'Added cms_pages.seo_description';
  END IF;
END $$;
