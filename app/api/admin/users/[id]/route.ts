import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin, getCurrentUserFromCookie } from '../../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../../lib/audit'

const SYSTEM_ROLES = ['ADMIN', 'ADMINISTRATOR', 'SYSTEM', 'SUPER_ADMIN']

export async function GET(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr

      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

      const supabase = createClient(url, key)
      const { data: user, error } = await supabase.from('users').select('id,email,full_name,role,status,company_id,created_at').eq('id', id).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ user })
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
      const { data: before } = await supabase.from('users').select('*').eq('id', id).maybeSingle()

      const updates: Record<string, unknown> = {}
      if (body.role !== undefined) updates.role = body.role
      if (body.status !== undefined) updates.status = body.status
      if (body.full_name !== undefined) updates.full_name = body.full_name
      if (body.company_id !== undefined) updates.company_id = body.company_id

      const { data: updated, error } = await supabase.from('users').update(updates).eq('id', id).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const adminUser = await getCurrentUserFromCookie()
      const auditAction = body.status === 'suspended' ? 'suspend' : body.status === 'active' ? 'activate' : 'update'
      await logAuditEvent({
        entityType: 'user',
        entityId: id,
        action: auditAction as any,
        performedBy: adminUser?.id ?? undefined,
        actorId: adminUser?.id ?? undefined,
        fromStatus: before?.status ?? undefined,
        toStatus: updated?.status ?? undefined,
        metadata: { before, after: updated },
      })

      return NextResponse.json({ user: updated })
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

      const { data: user } = await supabase.from('users').select('id,email,role,status').eq('id', id).maybeSingle()
      if (user && SYSTEM_ROLES.includes((user.role || '').toString().toUpperCase())) {
            return NextResponse.json({ error: 'Cannot delete a user with a protected system role' }, { status: 403 })
      }

      const { error } = await supabase.from('users').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const adminUser = await getCurrentUserFromCookie()
      await logAuditEvent({
        entityType: 'user',
        entityId: id,
        action: 'delete',
        performedBy: adminUser?.id ?? undefined,
        actorId: adminUser?.id ?? undefined,
        metadata: { deleted: true, email: (user as any)?.email },
      })

      return NextResponse.json({ success: true })
}
