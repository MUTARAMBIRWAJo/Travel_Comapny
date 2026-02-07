/**
 * Phase 7 — Visa & immigration intelligence.
 * Destination × nationality rules; lead-time; reminders (60/30/7 days).
 */

import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export interface VisaRequirement {
  destination_country_iso: string
  passport_nationality_iso: string
  visa_required: boolean
  lead_time_days: number | null
  notes: string | null
}

export async function getVisaRequirement(
  destinationCountryIso: string,
  passportNationalityIso: string
): Promise<VisaRequirement | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from("visa_requirements")
    .select("destination_country_iso, passport_nationality_iso, visa_required, lead_time_days, notes")
    .eq("destination_country_iso", destinationCountryIso.toUpperCase())
    .eq("passport_nationality_iso", passportNationalityIso.toUpperCase())
    .maybeSingle()
  return data
}

/** Suggested lead-time in days for a trip on departureDate; uses rule or default 30. */
export function suggestedLeadTimeDays(requirement: VisaRequirement | null, defaultDays = 30): number {
  if (!requirement?.visa_required) return 0
  return requirement.lead_time_days ?? defaultDays
}
