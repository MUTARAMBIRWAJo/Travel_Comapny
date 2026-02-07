/**
 * Phase 7 — Flight book. Idempotent by idempotency_key; no ticket without approval when required.
 */

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromCookie } from "@/lib/admin-auth"
import { bookFlight } from "@/lib/integrations/flights"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      offer_id,
      provider = "mock",
      traveler_ids,
      contact_email,
      idempotency_key,
      travel_request_id,
      approved_by,
    } = body as {
      offer_id: string
      provider?: string
      traveler_ids?: string[]
      contact_email?: string
      idempotency_key?: string
      travel_request_id?: string
      approved_by?: string
    }

    if (!offer_id) {
      return NextResponse.json({ error: "Missing offer_id" }, { status: 400 })
    }

    const idempotencyKey =
      idempotency_key || `flight-${offer_id}-${(user as { id: string }).id}-${Date.now()}`

    const companyId = (user as { company_id?: string }).company_id ?? null
    const isAdmin = ["ADMIN", "TRAVEL_AGENT"].includes(((user as { role?: string }).role || "").toUpperCase())
    const approvedBy = approved_by && isAdmin ? approved_by : isAdmin ? (user as { id: string }).id : null
    const mustBeApproved = !!companyId && !approvedBy

    const result = await bookFlight(
      {
        offer_id,
        provider,
        traveler_ids: Array.isArray(traveler_ids) ? traveler_ids : [(user as { id: string }).id],
        contact_email: contact_email || (user as { email?: string }).email || "",
        idempotency_key: idempotencyKey,
      },
      {
        travelRequestId: travel_request_id || null,
        companyId,
        userId: (user as { id: string }).id,
        approvedBy: approvedBy || undefined,
        mustBeApproved,
      }
    )

    if (!result.success) {
      const status = result.error_code === "APPROVAL_REQUIRED" ? 403 : 400
      return NextResponse.json(
        { error: result.error_message || "Booking failed", code: result.error_code },
        { status }
      )
    }

    return NextResponse.json({
      success: true,
      booking_id: result.flight_booking_id,
      external_id: result.external_id,
      pnr: result.pnr,
      e_ticket_number: result.e_ticket_number,
      approval_required: mustBeApproved,
    })
  } catch (err) {
    console.error("[flights/book]", err)
    return NextResponse.json({ error: "Booking failed" }, { status: 500 })
  }
}
