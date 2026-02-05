import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: any, context: any) {
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const slug = params?.slug
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      const supabase = createClient(url, key)

      const { data: page } = await supabase.from('cms_pages').select('*').eq('page_key', slug).eq('status', 'published').maybeSingle()
      if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      const { data: sections } = await supabase.from('cms_page_sections').select('*').eq('page_id', page.id).order('order_index', { ascending: true })

      return NextResponse.json({ page, sections })
}
