-- Add simple content versioning for CMS pages
CREATE TABLE IF NOT EXISTS public.cms_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_page_versions_page_id ON public.cms_page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_page_versions_created_at ON public.cms_page_versions(created_at DESC);
