/**
 * Phase 7 — Financial reconciliation export (audit-ready CSV/JSON).
 * Admin or authorized user; tenant-scoped.
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUserFromCookie } from "@/lib/admin-auth"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromCookie()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const { period_start, period_end, format = "csv" } = body as {
      period_start?: string
      period_end?: string
      format?: string
    }

    const companyId = (user as { company_id?: string }).company_id
    const isAdmin = ["ADMIN", "TRAVEL_AGENT"].includes(((user as { role?: string }).role || "").toUpperCase())
    if (!companyId && !isAdmin) {
      return NextResponse.json({ error: "Company context or admin required" }, { status: 403 })
    }

    const start = period_start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const end = period_end || new Date().toISOString().slice(0, 10)

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 })

    let query = supabase
      .from("invoices")
      .select("id, trip_id, user_id, amount, currency, status, issued_date, paid_date, created_at")
      .gte("created_at", start)
      .lte("created_at", end + "T23:59:59.999Z")
    if (companyId && !isAdmin) {
      const { data: companyUsers } = await supabase.from("users").select("id").eq("company_id", companyId)
      const userIds = (companyUsers ?? []).map((u: { id: string }) => u.id)
      if (userIds.length) {
        const { data: trips } = await supabase.from("trips").select("id").in("user_id", userIds)
        const tripIds = (trips ?? []).map((t: { id: string }) => t.id)
        if (tripIds.length) query = query.in("trip_id", tripIds)
        else query = query.eq("trip_id", "00000000-0000-0000-0000-000000000000")
      }
    }

    const { data: rows, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: exportRow } = await supabase
      .from("reconciliation_exports")
      .insert({
        company_id: companyId || null,
        period_start: start,
        period_end: end,
        format,
        created_by: (user as { id: string }).id,
      })
      .select("id, created_at")
      .single()

    if (format === "json") {
      return NextResponse.json({
        success: true,
        export_id: exportRow?.id,
        period_start: start,
        period_end: end,
        records: rows ?? [],
      })
    }

    const header = "id,trip_id,user_id,amount,currency,status,issued_date,paid_date,created_at"
    const lines = (rows ?? []).map(
      (r: Record<string, unknown>) =>
        [r.id, r.trip_id, r.user_id, r.amount, r.currency, r.status, r.issued_date, r.paid_date, r.created_at].join(",")
    )
    const csv = [header, ...lines].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="reconciliation-${start}-${end}.csv"`,
      },
    })
  } catch (err) {
    console.error("[reconciliation/export]", err)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
