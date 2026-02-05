import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../lib/admin-auth'
import { createUser } from '../../../../lib/auth-service'
import { logAuditEvent } from '../../../../lib/audit'

export async function GET(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

      const supabase = createClient(url, key)
      const params = new URL(request.url).searchParams
      const role = params.get('role')
      const companyId = params.get('companyId')

      let query = supabase.from('users').select('id,email,full_name,role,status,company_id,created_at').order('created_at', { ascending: false }).limit(200)
      if (role) query = query.eq('role', role)
      if (companyId) query = query.eq('company_id', companyId)

      const { data, error } = await query
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      return NextResponse.json({ users: data })
}

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr

      const body = await request.json()
      const { email, password = 'ChangeMe123!', full_name, role = 'TRAVEL_AGENT', company_id } = body

      if (!email || !full_name) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

      try {
            const user = await createUser(email, password, full_name, role, company_id)
            // Audit
            await logAuditEvent({ entityType: 'user', entityId: user.id, action: 'status_changed', actorId: null, metadata: { created_by_admin: true } as any })
            return NextResponse.json({ user })
      } catch (err: any) {
            return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 })
      }
}
