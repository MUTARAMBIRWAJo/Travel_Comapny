import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: users, error: queryError } = await supabase
      .from("users")
      .select("id, email, password_hash, full_name, role, preferred_language, preferred_currency, company_id")
      .eq("email", email.toLowerCase())
      .maybeSingle()

    if (queryError) {
      console.error("[v0] Query error:", queryError)
      throw queryError
    }

    if (!users) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, users.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session token
    const sessionToken = Buffer.from(`${users.id}:${Date.now()}`).toString("base64")

    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        role: users.role,
        language: users.preferred_language,
        currency: users.preferred_currency,
        company_id: users.company_id,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
