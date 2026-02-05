import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../../lib/audit'

const PROTECTED_ROLES = ['ADMIN', 'TRAVEL_AGENT', 'CORPORATE_CLIENT', 'CORPORATE_EMPLOYEE', 'INDIVIDUAL_TRAVELER']

export async function GET(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)
      const { data, error } = await supabase.from('roles').select('*').eq('id', id).maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ role: data })
}

export async function PUT(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const body = await request.json()
      const { permissions, description } = body

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { data: before } = await supabase.from('roles').select('*').eq('id', id).maybeSingle()
      const { data, error } = await supabase.from('roles').update({ permissions, description }).eq('id', id).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'role' as any, entityId: id, action: 'status_changed', metadata: { before, after: data } as any })

      return NextResponse.json({ role: data })
}

export async function DELETE(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { data: role } = await supabase.from('roles').select('*').eq('id', id).maybeSingle()
      if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 })

      if (PROTECTED_ROLES.includes((role.name || '').toString().toUpperCase())) {
            return NextResponse.json({ error: 'Protected role cannot be deleted' }, { status: 403 })
      }

      const { error } = await supabase.from('roles').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'role' as any, entityId: id, action: 'status_changed', metadata: { deleted: true } as any })

      return NextResponse.json({ success: true })
}
