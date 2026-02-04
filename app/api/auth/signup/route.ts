import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, role } = await request.json()

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .maybeSingle()

    if (checkError) {
      console.error("[v0] Check user error:", checkError)
      throw checkError
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    const roleMapping = {
      traveler: "traveler",
      corporate_client: "corporate_client",
      corporate_employee: "corporate_employee",
    }

    const dbRole = roleMapping[role] || "traveler"

    const passwordHash = await bcrypt.hash(password, 10)

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        role: dbRole,
        preferred_language: "en",
        preferred_currency: "USD",
      })
      .select("id, email, full_name, role")
      .single()

    if (createError) {
      console.error("[v0] Create user error:", createError)
      throw createError
    }

    const { error: notifError } = await supabase.from("notifications").insert({
      user_id: newUser.id,
      type: "in_app",
      title: "Welcome to We-Of-You",
      message: "Welcome! Your account has been created successfully. Explore our travel packages and start booking.",
      read: false,
      action_url: "/packages",
    })

    if (notifError) {
      console.warn("[v0] Notification error (non-critical):", notifError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.full_name,
          role: newUser.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
