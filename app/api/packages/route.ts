import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: packages, error } = await supabase.from("travel_packages").select("*").limit(50)

    if (error) throw error

    return NextResponse.json({ success: true, packages })
  } catch (error) {
    console.error("[v0] Get packages error:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}
