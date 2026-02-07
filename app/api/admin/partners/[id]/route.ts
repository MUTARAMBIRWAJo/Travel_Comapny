import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-auth"
import { logAuditEvent } from "@/lib/audit"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin()
  if (authErr) return authErr

  const { id } = await context.params
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  const supabase = createClient(url, key)
  const { data, error } = await supabase.from("partners").select("*").eq("id", id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Partner not found" }, { status: 404 })

  return NextResponse.json({ partner: data })
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin()
  if (authErr) return authErr

  const { id } = await context.params
  const body = await request.json()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  const supabase = createClient(url, key)
  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.partner_type !== undefined) updates.partner_type = body.partner_type
  if (body.contact !== undefined) updates.contact = body.contact
  if (body.sla !== undefined) updates.sla = body.sla
  if (body.commission_percent !== undefined) updates.commission_percent = body.commission_percent
  if (body.metadata !== undefined) updates.metadata = body.metadata
  if (body.tenant_id !== undefined) updates.tenant_id = body.tenant_id

  const { data, error } = await supabase.from("partners").update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAuditEvent({ entityType: "partner", entityId: id, action: "update", metadata: { updates: body } })

  return NextResponse.json({ partner: data })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin()
  if (authErr) return authErr

  const { id } = await context.params
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  const supabase = createClient(url, key)
  const { error } = await supabase.from("partners").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAuditEvent({ entityType: "partner", entityId: id, action: "delete", metadata: {} })

  return NextResponse.json({ success: true })
}
