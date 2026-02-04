import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    const supabase = createClient(url, key)

    const userId = request.nextUrl.searchParams.get("userId")

    let query = supabase.from("travel_requests").select("*").limit(50)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: requests, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, requests })
  } catch (error) {
    console.error("[v0] Get travel requests error:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, destination, departureDate, returnDate, type, budget } = body

    if (!userId || !destination) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    const supabase = createClient(url, key)

    const { data: travelRequest, error } = await supabase
      .from("travel_requests")
      .insert({
        user_id: userId,
        destination,
        start_date: departureDate || null,
        end_date: returnDate || null,
        purpose: type || "leisure",
        budget_usd: budget ? Number.parseFloat(budget) : null,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, travelRequest }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create travel request error:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
