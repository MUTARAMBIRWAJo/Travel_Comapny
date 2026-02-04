import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: users, error } = await supabase
      .from("users")
      .select("id,email,name,role,status,created_at")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({
      status: "Users Retrieved",
      count: users?.length || 0,
      users,
    })
  } catch (error) {
    console.error("[v0] Error retrieving users:", error)
    return NextResponse.json({ error: "Failed to retrieve users" }, { status: 500 })
  }
}
