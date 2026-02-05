import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../lib/audit'

const PROTECTED_ROLES = ['ADMIN', 'TRAVEL_AGENT', 'CORPORATE_CLIENT', 'CORPORATE_EMPLOYEE', 'INDIVIDUAL_TRAVELER']

export async function GET() {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
      const supabase = createClient(url, key)
      const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ roles: data })
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
