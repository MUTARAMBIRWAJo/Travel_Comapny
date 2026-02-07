/**
 * Phase 7 — Duty of care: report traveler location (manual or API).
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUserFromCookie } from "@/lib/admin-auth"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromCookie()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const {
      travel_request_id,
      trip_id,
      country_iso,
      city,
      lat,
      lng,
      location_type = "manual",
    } = body as {
      travel_request_id?: string
      trip_id?: string
      country_iso?: string
      city?: string
      lat?: number
      lng?: number
      location_type?: string
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 })

    const { data: row, error } = await supabase
      .from("traveler_locations")
      .insert({
        user_id: (user as { id: string }).id,
        travel_request_id: travel_request_id || null,
        trip_id: trip_id || null,
        location_type,
        country_iso: country_iso || null,
        city: city || null,
        lat: lat ?? null,
        lng: lng ?? null,
      })
      .select("id, reported_at")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, id: row.id, reported_at: row.reported_at })
  } catch (err) {
    console.error("[duty-of-care/location]", err)
    return NextResponse.json({ error: "Location report failed" }, { status: 500 })
  }
}
