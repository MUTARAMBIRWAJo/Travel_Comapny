import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { canTransition, REQUEST_STATUSES } from "@/lib/request-status"
import { logAuditEvent } from "@/lib/audit"

const LEGACY_STATUS_MAP: Record<string, string> = {
  pending: "submitted",
  approved: "approved",
  rejected: "cancelled",
  booked: "fulfilled",
  completed: "completed",
  cancelled: "cancelled",
  draft: "draft",
  submitted: "submitted",
  fulfilled: "fulfilled",
}

const normalizeStatus = (status: string) => {
  return LEGACY_STATUS_MAP[status] || status
}

function getSupabase(anon = true) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = anon ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    const userId = request.nextUrl.searchParams.get("userId")

    let query = supabase.from("travel_requests").select("*").limit(50)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: requests, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, requests })
  } catch (error) {
    console.error("[v0] Get travel requests error:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, destination, departureDate, returnDate, type, budget, status } = body

    if (!userId || !destination) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabase(false)
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    const initialStatus = normalizeStatus(status || "submitted")
    if (!REQUEST_STATUSES.includes(initialStatus as (typeof REQUEST_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data: travelRequest, error } = await supabase
      .from("travel_requests")
      .insert({
        user_id: userId,
        destination,
        start_date: departureDate || null,
        end_date: returnDate || null,
        purpose: type || "leisure",
        budget_usd: budget ? Number.parseFloat(budget) : null,
        status: initialStatus,
      })
      .select()
      .single()

    if (error) throw error

    await logAuditEvent({
      entityType: "travel_request",
      entityId: travelRequest.id,
      action: "status_changed",
      fromStatus: null,
      toStatus: initialStatus,
      actorId: userId,
    })

    return NextResponse.json({ success: true, travelRequest }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create travel request error:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, action, actorId, rejectionReason } = body

    if (!id) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    }

    const supabase = getSupabase(false)
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    const { data: existing, error: fetchError } = await supabase
      .from("travel_requests")
      .select("id,status")
      .eq("id", id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const currentStatus = normalizeStatus(existing.status)
    let targetStatus = status ? normalizeStatus(status) : ""
    let auditAction: "status_changed" | "approved" | "rejected" = "status_changed"

    if (action === "approve") {
      targetStatus = "approved"
      auditAction = "approved"
    }

    if (action === "reject") {
      targetStatus = "cancelled"
      auditAction = "rejected"
    }

    if (!REQUEST_STATUSES.includes(targetStatus as (typeof REQUEST_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    if (!canTransition(currentStatus, targetStatus)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentStatus} to ${targetStatus}` },
        { status: 400 },
      )
    }

    const updatePayload: Record<string, unknown> = {
      status: targetStatus,
      updated_at: new Date().toISOString(),
    }

    if (auditAction === "approved") {
      updatePayload.approved_by = actorId || null
      updatePayload.approved_at = new Date().toISOString()
    }

    if (auditAction === "rejected") {
      updatePayload.rejection_reason = rejectionReason || "Rejected"
    }

    const { data: updated, error } = await supabase
      .from("travel_requests")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await logAuditEvent({
      entityType: "travel_request",
      entityId: id,
      action: auditAction,
      fromStatus: currentStatus,
      toStatus: targetStatus,
      actorId,
      metadata: auditAction === "rejected" ? { rejectionReason } : undefined,
    })

    return NextResponse.json({ success: true, request: updated })
  } catch (error) {
    console.error("[v0] Update travel request error:", error)
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
  }
}
