/**
 * Phase 7 — Flight adapter interface.
 * Implementations: mockAdapter, amadeusAdapter, airlineDirectAdapter (RwandAir).
 */

import type {
  FlightSearchParams,
  InternalFlightOffer,
  InternalBookingRequest,
  InternalBookingResult,
} from "./types"

export interface IFlightBookingAdapter {
  readonly name: string

  /**
   * Search flights. Returns unified InternalFlightOffer[].
   * Implementations must handle errors and return [] on failure.
   */
  search(params: FlightSearchParams): Promise<InternalFlightOffer[]>

  /**
   * Book a flight. Idempotent when same idempotency_key is used.
   * No ticket issued without explicit approval in our system.
   */
  book(request: InternalBookingRequest): Promise<InternalBookingResult>

  /**
   * Cancel or request refund. Optional; not all providers support.
   */
  cancel?(externalId: string): Promise<{ success: boolean; message?: string }>
}
