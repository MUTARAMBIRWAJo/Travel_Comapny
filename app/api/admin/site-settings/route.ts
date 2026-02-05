import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../lib/audit'

export async function GET() {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      const supabase = createClient(url, key)
      const { data, error } = await supabase.from('site_settings').select('*').order('key', { ascending: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ settings: data })
}

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const body = await request.json()
      const { key, value, type = 'string', description } = body
      if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key_ = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key_!)

      const { data, error } = await supabase.from('site_settings').upsert({ key, value, type, description }, { onConflict: 'key' }).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'site_setting' as any, entityId: data.id, action: 'status_changed', metadata: { created: true, key } as any })

      return NextResponse.json({ setting: data })
}