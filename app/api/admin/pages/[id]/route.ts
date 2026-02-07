import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin, getCurrentUserFromCookie } from '../../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../../lib/audit'

function normalizeSection(s: any) {
  return {
    type: s.type || s.section_type || 'text',
    content_json: s.content_json || (s.content_en != null ? { text: s.content_en } : {}),
  }
}

export async function GET(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { data: page, error } = await supabase.from('cms_pages').select('*').eq('id', id).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 })

      const { data: rawSections } = await supabase.from('cms_page_sections').select('*').eq('page_id', id).order('order_index', { ascending: true })
      const sections = (rawSections || []).map(normalizeSection)
      const pageForEditor = { ...page, title: page.title || (page as any).title_en, slug: page.page_key || (page as any).slug }

      return NextResponse.json({ page: pageForEditor, sections })
}

export async function PUT(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const body = await request.json()

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { data: before } = await supabase.from('cms_pages').select('*').eq('id', id).maybeSingle()

      const { title, slug, status, seo_title, seo_description, sections } = body
      const updates: any = {}
      if (title !== undefined) updates.title = title
      if (slug !== undefined) updates.page_key = slug
      if (status !== undefined) updates.status = status
      if (seo_title !== undefined) updates.seo_title = seo_title
      if (seo_description !== undefined) updates.seo_description = seo_description

      const { data: updated, error } = await supabase.from('cms_pages').update(updates).eq('id', id).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Replace sections if provided (write type + section_type, content_json for compatibility)
      if (sections && Array.isArray(sections)) {
            await supabase.from('cms_page_sections').delete().eq('page_id', id)
            const insertSections = sections.map((s: any, i: number) => ({
              page_id: id,
              type: s.type || 'text',
              content_json: s.content_json || s.content || {},
              order_index: i,
            }))
            if (insertSections.length > 0) await supabase.from('cms_page_sections').insert(insertSections)
      }

      const pageKey = (updated?.page_key || slug || updated?.slug) as string
      if (pageKey) {
            const adminUser = await getCurrentUserFromCookie()
            const { data: versionRow } = await supabase.from('cms_page_versions').insert({
              page_key: pageKey,
              title_en: updated?.title || (updated as any)?.title_en,
              slug: pageKey,
              content_en: null,
              seo_title: updated?.seo_title ?? (updated as any)?.seo_title,
              seo_description: updated?.seo_description ?? (updated as any)?.seo_description,
              is_published: status === 'published',
              published_at: status === 'published' ? new Date() : null,
              created_by: adminUser?.id ?? null,
            }).select().maybeSingle()

            if (status === 'published' && versionRow?.id) {
              await supabase.from('cms_page_versions').update({ is_published: false }).eq('page_key', pageKey).neq('id', versionRow.id)
              await supabase.from('cms_page_versions').update({ is_published: true, published_at: new Date() }).eq('id', versionRow.id)
            }
      }

      await logAuditEvent({ entityType: 'page' as any, entityId: id, action: 'update', metadata: { before, after: updated } as any })

      return NextResponse.json({ page: updated })
}

export async function DELETE(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { error } = await supabase.from('cms_pages').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'page' as any, entityId: id, action: 'status_changed', metadata: { deleted: true } as any })

      return NextResponse.json({ success: true })
}
