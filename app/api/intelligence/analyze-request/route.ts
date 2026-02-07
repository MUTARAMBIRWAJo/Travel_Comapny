import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromCookie, requirePermission } from "@/lib/admin-auth"
import { PERMISSIONS } from "@/lib/rbac"
import { getOrAnalyze } from "@/lib/intelligence"
import type { AnalyzeRequestInput } from "@/lib/intelligence/types"

/**
 * POST /api/intelligence/analyze-request
 * Analyzes a travel or service request: risk, policy compliance, cost optimization, ESG.
 * Rule-based only; results are explainable and auditable.
 * Requires VIEW_ANALYTICS or APPROVE_REQUESTS or MANAGE_SERVICE_REQUESTS.
 */
export async function POST(request: NextRequest) {
  const err1 = await requirePermission(PERMISSIONS.VIEW_ANALYTICS)
  const err2 = await requirePermission(PERMISSIONS.APPROVE_REQUESTS)
  const err3 = await requirePermission(PERMISSIONS.MANAGE_SERVICE_REQUESTS)
  if (err1 && err2 && err3) return err1

  try {
    const user = await getCurrentUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const input: AnalyzeRequestInput = {
      requestId: body.requestId ?? body.request_id,
      requestType: body.requestType ?? body.request_type ?? "travel",
      destination_country: body.destination_country ?? body.destination?.split(",").pop()?.trim(),
      destination_city: body.destination_city ?? body.destination,
      start_date: body.start_date ?? body.departureDate ?? body.start_date,
      end_date: body.end_date ?? body.returnDate ?? body.end_date,
      travel_date: body.travel_date ?? body.travel_date,
      trip_duration_days: body.trip_duration_days,
      budget_usd: body.budget_usd ?? body.budget ?? body.budget_usd,
      travelers_count: body.travelers_count ?? body.travelersCount ?? 1,
      travel_class: body.travel_class ?? body.travelClass,
      transport_type: body.transport_type ?? body.transportType ?? "flight",
      user_id: body.user_id ?? body.userId,
      company_id: body.company_id ?? body.companyId,
      policy: body.policy,
    }

    const analysis = getOrAnalyze(input)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("[intelligence] analyze-request error:", error)
    return NextResponse.json(
      { error: "Failed to analyze request" },
      { status: 500 }
    )
  }
}
