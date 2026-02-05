import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { canTransition, REQUEST_STATUSES } from "@/lib/request-status"
import { logAuditEvent } from "@/lib/audit"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function resolveActorId(request: NextRequest, actorId?: string | null) {
  if (actorId) return actorId
  const token = request.cookies.get("session_token")?.value
  if (!token) return null
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    return decoded.split(":")[0] || null
  } catch (error) {
    console.warn("[v0] Failed to parse session token:", error)
    return null
  }
}

const LEGACY_STATUS_MAP: Record<string, string> = {
  pending: "submitted",
  under_review: "submitted",
  approved: "approved",
  rejected: "cancelled",
  completed: "completed",
  cancelled: "cancelled",
  draft: "draft",
  submitted: "submitted",
  fulfilled: "fulfilled",
}

const normalizeStatus = (status: string) => {
  return LEGACY_STATUS_MAP[status] || status
}

const STATUS_FILTERS: Record<string, string[]> = {
  draft: ["draft"],
  submitted: ["submitted", "pending", "under_review"],
  approved: ["approved"],
  fulfilled: ["fulfilled", "processing", "in_progress"],
  completed: ["completed"],
  cancelled: ["cancelled", "rejected"],
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    const status = request.nextUrl.searchParams.get("status")

    let query = supabase
      .from("service_requests")
      .select("*, documents:request_documents(*)")
      .order("created_at", { ascending: false })

    if (status) {
      const normalized = normalizeStatus(status)
      const filterValues = STATUS_FILTERS[normalized] || [normalized]
      query = query.in("status", filterValues)
    }

    const { data, error } = await query

    if (error) {
      console.log('[v0] Error fetching requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch requests', requests: [] },
        { status: 500 }
      )
    }

    const requests = (data || []).map((req) => ({
      ...req,
      status: normalizeStatus(req.status),
    }))

    return NextResponse.json(
      {
        requests,
        total: requests.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.log("[v0] Error in GET /api/service-requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests", requests: [] },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      service_type,
      traveller_name,
      traveller_email,
      traveller_phone,
      traveller_country,
      destination,
      travel_date,
      budget_usd,
      description,
      documents,
      status,
      user_id,
    } = body
    if (normalizeStatus(status || "submitted") !== "draft") {
      if (!traveller_name || !traveller_email || !destination || !travel_date) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        )
      }
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    const initialStatus = normalizeStatus(status || "submitted")
    if (!REQUEST_STATUSES.includes(initialStatus as (typeof REQUEST_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Insert service request
    const { data, error } = await supabase
      .from("service_requests")
      .insert({
        service_type,
        traveller_name,
        traveller_email,
        traveller_phone,
        traveller_country,
        destination,
        travel_date,
        budget_usd: budget_usd || 0,
        description,
        status: initialStatus,
        user_id: user_id || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.log("[v0] Error creating request:", error)
      return NextResponse.json(
        { error: "Failed to create request" },
        { status: 500 },
      )
    }

    // Link documents if provided
    if (documents && documents.length > 0 && data) {
      const documentRecords = documents.map((docPath: string) => ({
        service_request_id: data.id,
        document_type: "supporting",
        file_name: docPath.split("/").pop(),
        file_path: docPath,
        status: "pending",
        created_at: new Date().toISOString(),
      }))

      const { data: insertedDocs } = await supabase
        .from("request_documents")
        .insert(documentRecords)
        .select("id,file_path")

      await Promise.all(
        (insertedDocs || []).map((doc) =>
          logAuditEvent({
            entityType: "document",
            entityId: doc.id,
            action: "document_uploaded",
            actorId: data.user_id || null,
            metadata: { filePath: doc.file_path },
          }),
        ),
      )
    }

    await logAuditEvent({
      entityType: "service_request",
      entityId: data.id,
      action: "status_changed",
      fromStatus: null,
      toStatus: initialStatus,
      actorId: data.user_id || null,
    })

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: "Service request created successfully",
    }, { status: 201 })
  } catch (error) {
    console.log("[v0] Error in POST /api/service-requests:", error)
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      status,
      action,
      actorId,
      rejectionReason,
      service_type,
      traveller_name,
      traveller_email,
      traveller_phone,
      traveller_country,
      destination,
      travel_date,
      budget_usd,
      description,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    const { data: existing, error: fetchError } = await supabase
      .from("service_requests")
      .select("id,status,traveller_name,traveller_email,destination,travel_date")
      .eq("id", id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const currentStatus = normalizeStatus(existing.status)
    const resolvedActorId = resolveActorId(request, actorId)
    let targetStatus = status ? normalizeStatus(status) : currentStatus
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

    if (status && !canTransition(currentStatus, targetStatus)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentStatus} to ${targetStatus}` },
        { status: 400 },
      )
    }

    if (targetStatus === "submitted") {
      const mergedName = traveller_name ?? existing.traveller_name
      const mergedEmail = traveller_email ?? existing.traveller_email
      const mergedDestination = destination ?? existing.destination
      const mergedDate = travel_date ?? existing.travel_date

      if (!mergedName || !mergedEmail || !mergedDestination || !mergedDate) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        )
      }
    }

    const updatePayload: Record<string, unknown> = {
      status: targetStatus,
      updated_at: new Date().toISOString(),
    }

    if (service_type) updatePayload.service_type = service_type
    if (traveller_name) updatePayload.traveller_name = traveller_name
    if (traveller_email) updatePayload.traveller_email = traveller_email
    if (traveller_phone !== undefined) updatePayload.traveller_phone = traveller_phone
    if (traveller_country !== undefined) updatePayload.traveller_country = traveller_country
    if (destination) updatePayload.destination = destination
    if (travel_date) updatePayload.travel_date = travel_date
    if (budget_usd !== undefined) updatePayload.budget_usd = budget_usd
    if (description !== undefined) updatePayload.description = description

    if (auditAction === "approved") {
      updatePayload.approved_by = resolvedActorId || null
      updatePayload.approved_at = new Date().toISOString()
      updatePayload.reviewed_at = new Date().toISOString()
    }

    if (auditAction === "rejected") {
      updatePayload.rejection_reason = rejectionReason || "Rejected"
      updatePayload.reviewed_at = new Date().toISOString()
    }

    const { data: updated, error } = await supabase
      .from("service_requests")
      .update(updatePayload)
      .eq("id", id)
      .select("*, documents:request_documents(*)")
      .single()

    if (error) throw error

    await logAuditEvent({
      entityType: "service_request",
      entityId: id,
      action: auditAction,
      fromStatus: currentStatus,
      toStatus: targetStatus,
      actorId: resolvedActorId,
      metadata: auditAction === "rejected" ? { rejectionReason } : undefined,
    })

    return NextResponse.json({ success: true, request: updated })
  } catch (error) {
    console.log("[v0] Error in PATCH /api/service-requests:", error)
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 },
    )
  }
}
