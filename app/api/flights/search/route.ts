/**
 * Phase 7 — Flight search. Policy-compliant results; approval warnings when applicable.
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUserFromCookie } from "@/lib/admin-auth"
import { searchFlights } from "@/lib/integrations/flights"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const origin = searchParams.get("origin")?.toUpperCase() || ""
    const destination = searchParams.get("destination")?.toUpperCase() || ""
    const departure_date = searchParams.get("departure_date") || ""
    const return_date = searchParams.get("return_date") || undefined
    const adults = Math.min(9, Math.max(1, parseInt(searchParams.get("adults") || "1", 10)))
    const cabin_class = searchParams.get("cabin_class") || undefined
    const max_results = Math.min(50, Math.max(5, parseInt(searchParams.get("max_results") || "10", 10)))

    if (!origin || !destination || !departure_date) {
      return NextResponse.json(
        { error: "Missing required query params: origin, destination, departure_date" },
        { status: 400 }
      )
    }

    const companyId = (user as { company_id?: string }).company_id ?? null
    let policy: { travel_class_rules?: string; max_budget_usd?: number; restricted_destinations?: string[] } | undefined
    if (companyId) {
      const supabase = getSupabase()
      if (supabase) {
        const { data: company } = await supabase
          .from("companies")
          .select("settings")
          .eq("id", companyId)
          .maybeSingle()
        const settings = (company as { settings?: { travel_class_rules?: string; max_budget_usd?: number; restricted_destinations?: string[] } })?.settings
        if (settings) {
          policy = {
            travel_class_rules: settings.travel_class_rules,
            max_budget_usd: settings.max_budget_usd,
            restricted_destinations: settings.restricted_destinations,
          }
        }
      }
    }

    const { offers, policy_warnings } = await searchFlights(
      {
        origin,
        destination,
        departure_date,
        return_date,
        adults,
        cabin_class,
        max_results,
      },
      { companyId, policy, userId: (user as { id: string }).id }
    )

    return NextResponse.json({
      success: true,
      offers,
      policy_warnings,
    })
  } catch (err) {
    console.error("[flights/search]", err)
    return NextResponse.json({ error: "Flight search failed" }, { status: 500 })
  }
}
