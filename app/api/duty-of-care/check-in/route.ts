/**
 * Phase 7 — Duty of care: traveler check-in (safe / delayed / incident).
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUserFromCookie } from "@/lib/admin-auth"
import { logAuditEvent } from "@/lib/audit"

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

    const body = await request.json()
    const { status = "safe", message, travel_request_id } = body as {
      status?: string
      message?: string
      travel_request_id?: string
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 })

    const checkInStatus = status === "delayed" || status === "incident" ? status : "safe"
    const { data: row, error } = await supabase
      .from("duty_of_care_check_ins")
      .insert({
        user_id: (user as { id: string }).id,
        travel_request_id: travel_request_id || null,
        status: checkInStatus,
        message: message || null,
      })
      .select("id, checked_in_at")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await logAuditEvent({
      entityType: "duty_of_care_check_in",
      entityId: row.id,
      action: "create",
      performedBy: (user as { id: string }).id,
      metadata: { status: checkInStatus, travel_request_id: travel_request_id ?? null },
    })

    return NextResponse.json({ success: true, id: row.id, checked_in_at: row.checked_in_at })
  } catch (err) {
    console.error("[duty-of-care/check-in]", err)
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 })
  }
}
