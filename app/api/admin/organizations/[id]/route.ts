import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../../lib/audit'

export async function GET(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr

      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

      const supabase = createClient(url, key)
      const { data: org, error } = await supabase.from('companies').select('*').eq('id', id).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ organization: org })
}

export async function PUT(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const body = await request.json()

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

      const supabase = createClient(url, key)
      const { data: before } = await supabase.from('companies').select('*').eq('id', id).maybeSingle()

      const updates: any = {}
      if (body.name) updates.name = body.name
      if (body.billing_email) updates.billing_email = body.billing_email
      if (body.settings !== undefined) updates.settings = body.settings

      const { data: updated, error } = await supabase.from('companies').update(updates).eq('id', id).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Audit
      await logAuditEvent({ entityType: 'organization', entityId: id, action: 'status_changed', actorId: null, fromStatus: before?.name, toStatus: updated?.name, metadata: { before, after: updated } as any })

      return NextResponse.json({ organization: updated })
}

export async function DELETE(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

      const supabase = createClient(url, key)

      const { error } = await supabase.from('companies').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'organization', entityId: id, action: 'status_changed', actorId: null, metadata: { deleted: true } as any })

      return NextResponse.json({ success: true })
}