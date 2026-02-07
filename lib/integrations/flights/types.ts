/**
 * Phase 7 — Flight integration: unified internal types.
 * All adapters (Amadeus, RwandAir direct, mock) normalize to these.
 */

export interface InternalFlightSegment {
  departure_airport: string
  arrival_airport: string
  departure_at: string // ISO datetime
  arrival_at: string
  flight_number: string
  carrier: string
  cabin_class: string
  duration_minutes?: number
}

export interface InternalFlightOffer {
  id: string
  provider: string
  total_amount_usd: number
  currency: string
  segments: InternalFlightSegment[]
  fare_rules_summary?: string
  baggage_allowance?: string
  booking_class?: string
  valid_until_utc?: string // price lock expiry
}

export interface InternalBookingRequest {
  offer_id: string
  provider: string
  traveler_ids: string[]
  contact_email: string
  idempotency_key: string
}

export interface InternalBookingResult {
  success: boolean
  booking_id?: string
  external_id?: string
  pnr?: string
  e_ticket_number?: string
  error_code?: string
  error_message?: string
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departure_date: string // YYYY-MM-DD
  return_date?: string
  adults: number
  cabin_class?: string
  max_results?: number
}
