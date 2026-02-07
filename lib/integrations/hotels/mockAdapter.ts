/**
 * Phase 7 — Mock hotel adapter.
 */

import type { InternalHotelOffer, InternalHotelBookingRequest, InternalHotelBookingResult, HotelSearchParams } from "./types"

export const mockHotelAdapter = {
  name: "mock",

  async search(params: HotelSearchParams): Promise<InternalHotelOffer[]> {
    const offers: InternalHotelOffer[] = [
      {
        id: `mock-hotel-${params.destination}-${params.check_in}-1`,
        provider: "mock",
        property_name: "Mock Business Hotel",
        check_in: params.check_in,
        check_out: params.check_out,
        amount_usd: 120,
        currency: "USD",
        cancellation_rules: "Free cancellation until 24h before check-in.",
        room_type: "Standard",
        valid_until_utc: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    ]
    return offers.slice(0, params.max_results ?? 10)
  },

  async book(request: InternalHotelBookingRequest): Promise<InternalHotelBookingResult> {
    return {
      success: true,
      external_id: `MOCK-H-${request.idempotency_key.slice(0, 12)}`,
      confirmation_code: `MOCK${Date.now().toString(36).toUpperCase()}`,
    }
  },
}
