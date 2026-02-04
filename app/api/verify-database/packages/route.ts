import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: packages, error } = await supabase
      .from("travel_packages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      status: "Packages Retrieved",
      count: packages?.length || 0,
      packages,
    })
  } catch (error) {
    console.error("[v0] Error retrieving packages:", error)
    return NextResponse.json({ error: "Failed to retrieve packages" }, { status: 500 })
  }
}
