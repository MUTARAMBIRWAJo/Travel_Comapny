import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin, getCurrentUserFromCookie } from '../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../lib/audit'

export async function GET(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      const supabase = createClient(url, key)

      const params = new URL(request.url).searchParams
      const page = Math.max(1, parseInt(params.get('page') || '1', 10))
      const limit = Math.min(100, Math.max(10, parseInt(params.get('limit') || '20', 10)))
      const offset = (page - 1) * limit
      const { data, error, count } = await supabase.from('cms_pages').select('*', { count: 'exact' }).order('created_at', { ascending: true }).range(offset, offset + limit - 1)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ pages: data || [], total: count ?? 0, page, limit })
}

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const body = await request.json()
      const { title, slug, status = 'draft', seo_title = null, seo_description = null, sections = [], content = null } = body
      if (!title || !slug) return NextResponse.json({ error: 'Missing title or slug' }, { status: 400 })

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      // Ensure base page exists or update it (title_en for legacy schema)
      const { data: pageBase, error: pageError } = await supabase
            .from('cms_pages')
            .upsert({ title, title_en: title, slug, page_key: slug, status, seo_title, seo_description })
            .select()
            .maybeSingle()

      if (pageError) return NextResponse.json({ error: pageError.message }, { status: 500 })

      // Insert or update sections linked to the base page
      if (sections && sections.length > 0 && pageBase && pageBase.id) {
            // For simplicity, delete existing sections and re-insert (idempotent for admin save)
            await supabase.from('cms_page_sections').delete().eq('page_id', pageBase.id)
            const insertSections = sections.map((s: any, i: number) => ({ page_id: pageBase.id, type: s.type, content_json: s.content_json || s.content || {}, order_index: i }))
            await supabase.from('cms_page_sections').insert(insertSections)
      }

      // Get current admin user for audit and created_by
      const adminUser = await getCurrentUserFromCookie()

      // Create a new page version entry
      const { data: versionData, error: versionError } = await supabase
            .from('cms_page_versions')
            .insert({
                  page_key: slug,
                  title_en: title,
                  slug,
                  content_en: content,
                  seo_title,
                  seo_description,
                  is_published: status === 'published',
                  published_at: status === 'published' ? new Date() : null,
                  created_by: adminUser?.id || null
            })
            .select()
            .maybeSingle()

      if (versionError) return NextResponse.json({ error: versionError.message }, { status: 500 })

      // If publishing, unpublish other versions for this page_key
      if (status === 'published' && versionData && versionData.id) {
            await supabase
                  .from('cms_page_versions')
                  .update({ is_published: false })
                  .eq('page_key', slug)
                  .neq('id', versionData.id)

            await supabase
                  .from('cms_page_versions')
                  .update({ is_published: true, published_at: new Date() })
                  .eq('id', versionData.id)
      }

      // Log admin action
      await logAuditEvent({
            entityType: 'cms_page_versions',
            entityId: versionData?.id || pageBase?.id,
            action: status === 'published' ? ('approved' as any) : ('status_changed' as any),
            actorId: adminUser?.id || null,
            metadata: { page_key: slug, title, published: status === 'published' }
      })

      return NextResponse.json({ page: pageBase, version: versionData })
}
