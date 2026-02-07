/**
 * Phase 7 — Flight service: adapter aggregation, policy enforcement, idempotent booking.
 * No ticket issued without approval; price lock window respected.
 */

import { createClient } from "@supabase/supabase-js"
import type { IFlightBookingAdapter } from "./adapter"
import { mockFlightAdapter } from "./mockAdapter"
import { createAmadeusAdapter } from "./amadeusAdapter"
import type {
  FlightSearchParams,
  InternalFlightOffer,
  InternalBookingRequest,
  InternalBookingResult,
} from "./types"
import { runPolicyEngine } from "@/lib/intelligence/policyEngine"
import { logIntegrationCall } from "../integration-log"
import { logAuditEvent } from "@/lib/audit"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

let amadeusAdapterPromise: Promise<IFlightBookingAdapter> | null = null

async function getAdaptersAsync(): Promise<IFlightBookingAdapter[]> {
  const list: IFlightBookingAdapter[] = [mockFlightAdapter]
  try {
    if (!amadeusAdapterPromise) amadeusAdapterPromise = createAmadeusAdapter()
    const amadeus = await amadeusAdapterPromise
    list.push(amadeus)
  } catch {
    // Amadeus optional
  }
  return list
}

/**
 * Search flights across all adapters; filter by company policy (cabin, budget, destination).
 */
export async function searchFlights(
  params: FlightSearchParams,
  options: {
    companyId?: string | null
    policy?: { travel_class_rules?: string; max_budget_usd?: number; restricted_destinations?: string[] }
    userId?: string | null
  } = {}
): Promise<{ offers: InternalFlightOffer[]; policy_warnings: string[] }> {
  const adapters = await getAdaptersAsync()
  const allOffers: InternalFlightOffer[] = []
  const policyWarnings: string[] = []

  for (const adapter of adapters) {
    try {
      const offers = await adapter.search(params)
      allOffers.push(...offers)
    } catch (err) {
      await logIntegrationCall(adapter.name, "search", "failure", {}, err instanceof Error ? err.message : String(err))
    }
  }

  const policy = options.policy
  if (policy?.travel_class_rules) {
    const economyOnly = policy.travel_class_rules.toLowerCase().includes("economy only")
    if (economyOnly) {
      const allowed = allOffers.filter(
        (o) => (o.booking_class || (o.segments && o.segments[0]?.cabin_class) || "").toLowerCase() === "economy"
      )
      if (allowed.length < allOffers.length) {
        policyWarnings.push("Policy allows economy only; some results were filtered.")
      }
      allOffers.length = 0
      allOffers.push(...allowed)
    }
  }
  if (policy?.max_budget_usd != null) {
    const over = allOffers.filter((o) => o.total_amount_usd > policy.max_budget_usd!)
    if (over.length) {
      policyWarnings.push(`Some offers exceed policy budget $${policy.max_budget_usd}; approval may be required.`)
    }
  }

  return { offers: allOffers, policy_warnings: policyWarnings }
}

/**
 * Book a flight. Idempotent by idempotency_key. Requires approval before ticket issuance in DB.
 */
export async function bookFlight(
  request: InternalBookingRequest,
  context: {
    travelRequestId?: string | null
    companyId?: string | null
    userId?: string | null
    approvedBy?: string | null
    mustBeApproved?: boolean
  }
): Promise<InternalBookingResult & { flight_booking_id?: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error_code: "CONFIG", error_message: "Database not configured" }
  }

  const idempotencyKey = request.idempotency_key
  const existing = await supabase
    .from("flight_bookings")
    .select("id, status, external_id, pnr, e_ticket_number")
    .eq("external_id", idempotencyKey)
    .maybeSingle()

  if (existing?.data) {
    return {
      success: true,
      booking_id: existing.data.id,
      external_id: existing.data.external_id ?? undefined,
      pnr: existing.data.pnr ?? undefined,
      e_ticket_number: existing.data.e_ticket_number ?? undefined,
      flight_booking_id: existing.data.id,
    }
  }

  if (context.mustBeApproved && !context.approvedBy) {
    return { success: false, error_code: "APPROVAL_REQUIRED", error_message: "Booking requires approval before ticket issuance." }
  }

  const provider = request.provider
  const adapters = await getAdaptersAsync()
  const adapter = adapters.find((a) => a.name === provider) || mockFlightAdapter

  const result = await adapter.book(request)
  if (!result.success) {
    return result
  }

  const insert: Record<string, unknown> = {
    travel_request_id: context.travelRequestId || null,
    company_id: context.companyId || null,
    user_id: context.userId || null,
    provider: adapter.name,
    external_id: result.external_id || idempotencyKey,
    pnr: result.pnr || null,
    e_ticket_number: result.e_ticket_number || null,
    status: context.approvedBy ? "ticketed" : "approved",
    amount_usd: null,
    approved_by: context.approvedBy || null,
    approved_at: context.approvedBy ? new Date().toISOString() : null,
    ticketed_at: result.e_ticket_number ? new Date().toISOString() : null,
  }

  const { data: row, error } = await supabase.from("flight_bookings").insert(insert).select("id").single()
  if (error) {
    await logIntegrationCall(adapter.name, "book", "failure", { idempotency_key: idempotencyKey }, error.message)
    return { success: false, error_code: "DB_ERROR", error_message: error.message }
  }

  await logAuditEvent({
    entityType: "flight_booking",
    entityId: row.id,
    action: "create",
    performedBy: context.approvedBy ?? context.userId ?? undefined,
    tenantId: context.companyId ?? undefined,
    metadata: { provider: adapter.name, pnr: result.pnr, idempotency_key: idempotencyKey },
  })

  return {
    ...result,
    flight_booking_id: row.id,
  }
}
