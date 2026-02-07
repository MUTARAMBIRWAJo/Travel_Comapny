-- Create CMS base tables so later migrations (e.g. cms_page_versions) can reference them.
-- Safe: CREATE TABLE IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key varchar(100) UNIQUE NOT NULL,
  title varchar(255),
  title_en varchar(255),
  slug varchar(100),
  status varchar(50) DEFAULT 'published',
  seo_title varchar(255),
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  section_type varchar(50),
  type varchar(50),
  content_json jsonb DEFAULT '{}'::jsonb,
  content_en text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_pages_page_key ON public.cms_pages(page_key);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON public.cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_page_sections_page_id ON public.cms_page_sections(page_id);
