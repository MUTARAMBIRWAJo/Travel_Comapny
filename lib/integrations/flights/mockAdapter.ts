/**
 * Phase 7 — Mock flight adapter for development and fallback.
 * No real tickets; simulates search and book with deterministic data.
 */

import type { IFlightBookingAdapter } from "./adapter"
import type {
  FlightSearchParams,
  InternalFlightOffer,
  InternalBookingRequest,
  InternalBookingResult,
  InternalFlightSegment,
} from "./types"

function buildSegment(
  dep: string,
  arr: string,
  date: string,
  flightNum: string,
  cabin: string
): InternalFlightSegment {
  return {
    departure_airport: dep,
    arrival_airport: arr,
    departure_at: `${date}T08:00:00Z`,
    arrival_at: `${date}T10:30:00Z`,
    flight_number: flightNum,
    carrier: "RW",
    cabin_class: cabin || "economy",
    duration_minutes: 150,
  }
}

export const mockFlightAdapter: IFlightBookingAdapter = {
  name: "mock",

  async search(params: FlightSearchParams): Promise<InternalFlightOffer[]> {
    const cabin = params.cabin_class || "economy"
    const outbound = buildSegment(
      params.origin,
      params.destination,
      params.departure_date,
      "WB100",
      cabin
    )
    const offers: InternalFlightOffer[] = [
      {
        id: `mock-${params.origin}-${params.destination}-${params.departure_date}-1`,
        provider: "mock",
        total_amount_usd: 299.99,
        currency: "USD",
        segments: params.return_date
          ? [
              outbound,
              buildSegment(
                params.destination,
                params.origin,
                params.return_date,
                "WB101",
                cabin
              ),
            ]
          : [outbound],
        fare_rules_summary: "Non-refundable. Change fee applies.",
        baggage_allowance: "1 x 23kg",
        booking_class: cabin,
        valid_until_utc: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
      {
        id: `mock-${params.origin}-${params.destination}-${params.departure_date}-2`,
        provider: "mock",
        total_amount_usd: 449.99,
        currency: "USD",
        segments: params.return_date
          ? [
              outbound,
              buildSegment(
                params.destination,
                params.origin,
                params.return_date,
                "WB101",
                "business"
              ),
            ]
          : [outbound],
        fare_rules_summary: "Refundable. Free change.",
        baggage_allowance: "2 x 32kg",
        booking_class: "business",
        valid_until_utc: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    ]
    return offers.slice(0, params.max_results ?? 10)
  },

  async book(request: InternalBookingRequest): Promise<InternalBookingResult> {
    const externalId = `MOCK-${request.idempotency_key.slice(0, 12)}`
    return {
      success: true,
      booking_id: externalId,
      external_id: externalId,
      pnr: `MOCK${Date.now().toString(36).toUpperCase()}`,
      e_ticket_number: `000-${String(Math.floor(1000000000 + Math.random() * 8999999999))}`,
    }
  },

  async cancel(externalId: string) {
    if (!externalId.startsWith("MOCK-")) {
      return { success: false, message: "Unknown booking" }
    }
    return { success: true, message: "Cancellation requested" }
  },
}
