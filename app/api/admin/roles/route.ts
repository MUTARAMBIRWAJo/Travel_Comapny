import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../lib/audit'

const PROTECTED_ROLES = ['ADMIN', 'TRAVEL_AGENT', 'CORPORATE_CLIENT', 'CORPORATE_EMPLOYEE', 'INDIVIDUAL_TRAVELER']

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
      const { data, error, count } = await supabase.from('roles').select('*', { count: 'exact' }).order('created_at', { ascending: true }).range(offset, offset + limit - 1)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ roles: data || [], total: count ?? 0, page, limit })
}

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const body = await request.json()
      const { name, description, permissions = [] } = body
      if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabase = createClient(url!, key!)

      const { data, error } = await supabase.from('roles').insert({ name, description, permissions }).select().maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'role' as any, entityId: data.id, action: 'status_changed', metadata: { created: true, name } as any })

      return NextResponse.json({ role: data })
}

export async function DELETE(request: Request) {
      // Not supported globally; use role-specific delete
      return NextResponse.json({ error: 'Use /admin/roles/:id to delete role' }, { status: 405 })
}
