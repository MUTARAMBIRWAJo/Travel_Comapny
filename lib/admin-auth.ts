import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Lightweight admin/auth helpers.
 * - getCurrentUserFromCookie: returns user record (includes company_id as tenant)
 * - requireRole: enforce allowed roles (case-insensitive)
 * - requireAdmin: legacy convenience for admin/super_admin checks
 *
 * NOTE: This uses the service-role key to lookup users server-side. For production,
 * prefer validating JWTs and extracting claims for RLS instead of service role lookups.
 */

export async function getCurrentUserFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  if (!token) return null

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const userId = decoded.split(':')[0]
    if (!userId) return null

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null

    const supabase = createClient(url, key)
    const { data: user, error } = await supabase
      .from('users')
      .select('id,email,full_name,role,status,company_id')
      .eq('id', userId)
      .maybeSingle()
    if (error) return null

    // normalize shape: add tenantId for clarity
    return {
      ...user,
      tenantId: (user as any)?.company_id ?? null,
    }
  } catch (err) {
    return null
  }
}

/**
 * Enforce that the current user has one of the allowed roles.
 * - allowedRoles: array of role strings (case-insensitive)
 * Returns NextResponse (error) when not permitted, otherwise null.
 */
export async function requireRole(allowedRoles: string[]) {
  const user = await getCurrentUserFromCookie()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = ((user as any).role || '').toString().toLowerCase()
  const normalized = allowedRoles.map((r) => r.toString().toLowerCase())
  if (!normalized.includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

/**
 * Legacy convenience: require admin or super_admin
 */
export async function requireAdmin() {
  return requireRole(['super_admin', 'admin', 'administrator'])
}
