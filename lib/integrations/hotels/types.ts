/**
 * Phase 7 — Hotel integration: unified internal types.
 */

export interface InternalHotelOffer {
  id: string
  provider: string
  property_name: string
  property_id?: string
  check_in: string
  check_out: string
  amount_usd: number
  currency: string
  cancellation_rules?: string
  room_type?: string
  valid_until_utc?: string
}

export interface InternalHotelBookingRequest {
  offer_id: string
  provider: string
  guest_user_ids: string[]
  contact_email: string
  idempotency_key: string
}

export interface InternalHotelBookingResult {
  success: boolean
  booking_id?: string
  external_id?: string
  confirmation_code?: string
  error_code?: string
  error_message?: string
}

export interface HotelSearchParams {
  destination: string
  check_in: string
  check_out: string
  guests: number
  rooms?: number
  max_results?: number
}
