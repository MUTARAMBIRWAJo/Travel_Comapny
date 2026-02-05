import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../lib/audit'

export async function GET(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      const supabase = createClient(url, key)

      const { data, error } = await supabase.from('cms_pages').select('*').order('created_at', { ascending: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ pages: data })
}

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const body = await request.json()
      const { title, slug, status = 'draft', seo_title = null, seo_description = null, sections = [] } = body
      if (!title || !slug) return NextResponse.json({ error: 'Missing title or slug' }, { status: 400 })

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { data, error } = await supabase.from('cms_pages').insert({ title, slug, page_key: slug, status, seo_title, seo_description }).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Insert sections
      if (sections && sections.length > 0) {
            const insertSections = sections.map((s: any, i: number) => ({ page_id: data.id, type: s.type, content_json: s.content_json || s.content || {}, order_index: i }))
            await supabase.from('cms_page_sections').insert(insertSections)
      }

      await logAuditEvent({ entityType: 'page' as any, entityId: data.id, action: 'status_changed', metadata: { created: true } as any })

      return NextResponse.json({ page: data })
}
