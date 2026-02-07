/**
 * Phase 7 — Amadeus GDS adapter (stub).
 * Replace with real Amadeus SDK/API when credentials and contract are in place.
 * All external calls must be logged to integration_logs and failures handled.
 */

import type { IFlightBookingAdapter } from "./adapter"
import type {
  FlightSearchParams,
  InternalFlightOffer,
  InternalBookingRequest,
  InternalBookingResult,
} from "./types"
import { logIntegrationCall } from "../integration-log"

const PROVIDER = "amadeus"

export async function createAmadeusAdapter(): Promise<IFlightBookingAdapter> {
  const apiKey = process.env.AMADEUS_API_KEY
  const apiSecret = process.env.AMADEUS_API_SECRET
  const configured = !!(apiKey && apiSecret)

  return {
    name: "amadeus",

    async search(params: FlightSearchParams): Promise<InternalFlightOffer[]> {
      if (!configured) {
        await logIntegrationCall(PROVIDER, "search", "skipped", { reason: "not_configured" })
        return []
      }
      try {
        // TODO: Call Amadeus Flight Offers Search API
        // https://developers.amadeus.com/self-service/category/flights
        await logIntegrationCall(PROVIDER, "search", "success", {
          origin: params.origin,
          destination: params.destination,
          results: 0,
        })
        return []
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        await logIntegrationCall(PROVIDER, "search", "failure", {}, message)
        return []
      }
    },

    async book(request: InternalBookingRequest): Promise<InternalBookingResult> {
      if (!configured) {
        await logIntegrationCall(PROVIDER, "book", "skipped", { reason: "not_configured" })
        return { success: false, error_code: "NOT_CONFIGURED", error_message: "Amadeus not configured" }
      }
      try {
        // TODO: Amadeus Flight Create Order
        await logIntegrationCall(PROVIDER, "book", "failure", { offer_id: request.offer_id }, "Not implemented")
        return { success: false, error_code: "NOT_IMPLEMENTED", error_message: "Amadeus booking not yet implemented" }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        await logIntegrationCall(PROVIDER, "book", "failure", { offer_id: request.offer_id }, message)
        return { success: false, error_code: "EXCEPTION", error_message: message }
      }
    },
  }
}
