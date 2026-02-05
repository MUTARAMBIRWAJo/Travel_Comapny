import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: any, context: any) {
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const slug = params?.slug
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      const supabase = createClient(url, key)

      // Fetch latest published version first
      const { data: version, error: versionError } = await supabase
        .from('cms_page_versions')
        .select('*')
        .eq('page_key', slug)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (versionError) return NextResponse.json({ error: versionError.message || versionError }, { status: 500 });
      if (!version) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

      // Fetch base page record to obtain page id for sections (sections remain linked to cms_pages)
      const { data: pageBase, error: pageBaseError } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('page_key', slug)
        .maybeSingle();

      if (pageBaseError) return NextResponse.json({ error: pageBaseError.message || pageBaseError }, { status: 500 });

      const page = {
        page_key: version.page_key,
        title_en: version.title_en,
        title_rw: version.title_rw,
        title_fr: version.title_fr,
        slug: version.slug,
        content_en: version.content_en,
        content_rw: version.content_rw,
        content_fr: version.content_fr,
        seo_title: version.seo_title,
        seo_description: version.seo_description,
        published_at: version.published_at,
        last_updated: version.published_at || version.created_at
      };

      const { data: sections } = pageBase
        ? await supabase.from('cms_page_sections').select('*').eq('page_id', pageBase.id).order('order_index', { ascending: true })
        : { data: [] };

      const res = NextResponse.json({ page, sections })
      // If this version is published, allow short public caching (CDN/browser).
      // Unpublished content (should not reach this endpoint) will be marked no-store.
      if (version?.is_published) {
        // Browser cache: 60s, CDN/shared cache: 1 hour, allow stale while revalidate for brief window.
        res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=60')
      } else {
        res.headers.set('Cache-Control', 'no-store')
      }
      return res
}
