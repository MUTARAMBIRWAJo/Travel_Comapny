import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin, getCurrentUserFromCookie } from '../../../../lib/admin-auth'
import { createUser } from '../../../../lib/auth-service'
import { logAuditEvent } from '../../../../lib/audit'
import { validatePassword, getPasswordPolicyDescription } from '../../../../lib/password-policy'

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
      const page = Math.max(1, parseInt(params.get('page') || '1', 10))
      const limit = Math.min(100, Math.max(10, parseInt(params.get('limit') || '20', 10)))
      const offset = (page - 1) * limit

      let query = supabase.from('users').select('id,email,full_name,role,status,company_id,created_at', { count: 'exact' }).order('created_at', { ascending: false })
      if (role) query = query.eq('role', role)
      if (companyId) query = query.eq('company_id', companyId)

      const { data, error, count } = await query.range(offset, offset + limit - 1)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      return NextResponse.json({ users: data || [], total: count ?? 0, page, limit })
}

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr

      const body = await request.json()
      const { email, password = 'ChangeMe123!', full_name, role = 'TRAVEL_AGENT', company_id } = body

      if (!email || !full_name) return NextResponse.json({ error: 'Missing required fields: email, full_name' }, { status: 400 })

      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
            return NextResponse.json(
              { error: 'Password does not meet requirements', details: passwordValidation.errors, policy: getPasswordPolicyDescription() },
              { status: 400 }
            )
      }

      try {
            const user = await createUser(email, password, full_name, role, company_id)
            const adminUser = await getCurrentUserFromCookie()
            await logAuditEvent({
              entityType: 'user',
              entityId: user.id,
              action: 'create',
              performedBy: adminUser?.id ?? undefined,
              actorId: adminUser?.id ?? undefined,
              metadata: { created_by_admin: true, email: user.email, role: user.role },
            })
            return NextResponse.json({ user })
      } catch (err: any) {
            return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 })
      }
}
