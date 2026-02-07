# Phase 7 — External Integrations, Real Bookings & Ecosystem

## Overview

Phase 7 adds the integration layer for flights, hotels, visa intelligence, duty of care, financial reconciliation, and a public API platform. All external calls are logged; bookings are idempotent and approval-aware.

## Database (migration `20260210_phase7_integrations.sql`)

Run migrations as usual (`npm run db:apply-sql`). New tables:

| Table | Purpose |
|-------|--------|
| `flight_bookings` | Unified flight bookings (PNR, e-ticket); idempotent by `external_id` |
| `hotel_bookings` | Hotel reservations; link to travel_request and invoice |
| `visa_requirements` | Destination × passport nationality rules; lead-time days |
| `insurance_policies` | Per-trip or company insurance (schema only) |
| `risk_feeds` | Country risk / health / political (schema only) |
| `traveler_locations` | Duty of care: reported location per user/trip |
| `duty_of_care_check_ins` | Safe / delayed / incident check-ins |
| `duty_of_care_alerts` | Broadcast alerts to travelers |
| `integration_logs` | Audit log for all external API calls |
| `api_keys` | Public API keys (hashed); tenant + scopes |
| `cost_center_mapping` | ERP GL code mapping per company |
| `reconciliation_exports` | Audit-ready export batches |

## 7.1 Flight & GDS Integration

- **Adapters**: `lib/integrations/flights/` — interface `IFlightBookingAdapter`, `mockAdapter`, `amadeusAdapter` (stub when `AMADEUS_API_KEY` / `AMADEUS_API_SECRET` set).
- **Service**: `searchFlights()` aggregates adapters, applies company policy (cabin, budget), returns unified offers and policy warnings. `bookFlight()` is idempotent by `idempotency_key`; supports approval-required flow.
- **APIs**:
  - `GET /api/flights/search?origin=KGL&destination=NBO&departure_date=2026-03-01&adults=1` — policy-compliant results; requires auth.
  - `POST /api/flights/book` — body: `offer_id`, `provider`, `idempotency_key`, `travel_request_id`, optional `approved_by`. Returns PNR / e_ticket when adapter supports it.

## 7.2 Hotel Integration

- **Schema**: `hotel_bookings`; types and mock adapter in `lib/integrations/hotels/`.
- **Mock**: `mockAdapter` provides search and book for development. Real Booking.com / Expedia adapters can be added alongside.

## 7.3 Visa & Immigration

- **Service**: `lib/visa/visaService.ts` — `getVisaRequirement(destinationCountryIso, passportNationalityIso)`, `suggestedLeadTimeDays()`.
- **API**: `GET /api/visa/check?destination_country=US&passport_nationality=RW` — returns visa_required, lead_time_days, notes. Seed `visa_requirements` for your routes.

## 7.4 Insurance & Risk

- **Schema**: `insurance_policies`, `risk_feeds` created. Risk feeds can be populated by cron or external jobs; consumption is via existing intelligence/risk engine or future APIs.

## 7.5 Duty of Care

- **APIs**:
  - `POST /api/duty-of-care/check-in` — body: `status` (safe | delayed | incident), `message`, `travel_request_id`. Records check-in and audits.
  - `POST /api/duty-of-care/location` — body: `travel_request_id`, `trip_id`, `country_iso`, `city`, `lat`, `lng`, `location_type`. Records traveler location.

## 7.6 Financial & ERP

- **Reconciliation**: `POST /api/reconciliation/export` — body: `period_start`, `period_end`, `format` (csv | json). Returns CSV download or JSON; creates `reconciliation_exports` row. Company-scoped for non-admins.
- **Cost center**: `cost_center_mapping` table for ERP GL codes; admin UI or API can be added to manage it.

## 7.7 Public API Platform

- **Auth**: `lib/api-key-auth.ts` — `resolveApiKey(Authorization | X-API-Key)` verifies key against `api_keys` (hash + prefix), returns `company_id` and `scopes`. `requireScope(resolved, scope)` checks permission.
- **Key storage**: Store only `key_hash` (SHA-256) and `key_prefix` (first 8 chars). Client sends raw key in `Authorization: Bearer <key>` or `X-API-Key: <key>`.
- **Example**: `GET /api/public/travel-requests` — requires valid API key with scope `travel_requests` or `*`. Returns tenant-scoped travel requests with pagination (`limit`, `offset`).

## Constraints Respected

- **Financial safety**: No ticket issued without approval when `mustBeApproved`; idempotent booking by `idempotency_key`.
- **External APIs**: Abstracted behind adapters; failures logged to `integration_logs`; mock fallback for flights.
- **Audit**: Flight booking, check-in, and workflow events use existing `logAuditEvent` and `emitWorkflowEvent` where applicable.

## Next Steps

- Implement Amadeus (or RwandAir) flight adapter with real credentials.
- Add hotel provider adapters (Booking.com, Expedia).
- Seed `visa_requirements` for key destinations and nationalities.
- Populate `risk_feeds` from external risk providers.
- Admin UI for API key creation and cost center mapping.
