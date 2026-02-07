/**
 * Phase 7 — Visa requirement check by destination and passport nationality.
 */

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromCookie } from "@/lib/admin-auth"
import { getVisaRequirement, suggestedLeadTimeDays } from "@/lib/visa/visaService"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromCookie()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const dest = request.nextUrl.searchParams.get("destination_country")?.toUpperCase()
    const nationality = request.nextUrl.searchParams.get("passport_nationality")?.toUpperCase()
    if (!dest || !nationality) {
      return NextResponse.json(
        { error: "Query params required: destination_country, passport_nationality (ISO 2-letter)" },
        { status: 400 }
      )
    }

    const requirement = await getVisaRequirement(dest, nationality)
    const leadTimeDays = suggestedLeadTimeDays(requirement)

    return NextResponse.json({
      destination_country_iso: dest,
      passport_nationality_iso: nationality,
      visa_required: requirement?.visa_required ?? true,
      lead_time_days: requirement?.lead_time_days ?? 30,
      suggested_lead_time_days: leadTimeDays,
      notes: requirement?.notes ?? null,
    })
  } catch (err) {
    console.error("[visa/check]", err)
    return NextResponse.json({ error: "Visa check failed" }, { status: 500 })
  }
}
