import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-auth"
import { logAuditEvent } from "@/lib/audit"

/**
 * GET /api/admin/partners - List partners (paginated, optional tenant_id filter)
 * POST /api/admin/partners - Create partner (admin only)
 */
export async function GET(request: Request) {
  const authErr = await requireAdmin()
  if (authErr) return authErr

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  const supabase = createClient(url, key)
  const params = new URL(request.url).searchParams
  const tenantId = params.get("tenantId") || undefined
  const page = Math.max(1, parseInt(params.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(10, parseInt(params.get("limit") || "20", 10)))
  const offset = (page - 1) * limit

  let query = supabase.from("partners").select("*", { count: "exact" }).order("created_at", { ascending: false })
  if (tenantId) query = query.eq("tenant_id", tenantId)

  const { data, error, count } = await query.range(offset, offset + limit - 1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ partners: data || [], total: count ?? 0, page, limit })
}

export async function POST(request: Request) {
  const authErr = await requireAdmin()
  if (authErr) return authErr

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  const body = await request.json()
  const { tenant_id, partner_type, name, contact, sla, commission_percent, metadata } = body

  if (!name || !partner_type) {
    return NextResponse.json({ error: "Missing name or partner_type" }, { status: 400 })
  }

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from("partners")
    .insert({
      tenant_id: tenant_id || null,
      partner_type: partner_type,
      name,
      contact: contact || {},
      sla: sla || {},
      commission_percent: commission_percent ?? 0,
      metadata: metadata || {},
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAuditEvent({
    entityType: "partner",
    entityId: data.id,
    action: "create",
    metadata: { name: data.name, partner_type: data.partner_type },
  })

  return NextResponse.json({ partner: data })
}
