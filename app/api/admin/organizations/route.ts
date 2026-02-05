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
      const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: true }).limit(200)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ organizations: data })
}

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const body = await request.json()
      const { name, billing_email, settings = {} } = body
      if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { data, error } = await supabase.from('companies').insert({ name, billing_email, settings }).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'organization' as any, entityId: data.id, action: 'status_changed', metadata: { created: true, name } as any })

      return NextResponse.json({ organization: data })
}
