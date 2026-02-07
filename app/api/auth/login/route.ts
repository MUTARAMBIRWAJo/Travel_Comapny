import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { rateLimitResponse, AUTH_RATE_LIMIT } from "@/lib/rate-limit-api"
import { logAccessEvent, getRequestMeta } from "@/lib/access-log"

const SESSION_MAX_AGE_SECONDS = process.env.SESSION_MAX_AGE_SECONDS
  ? parseInt(process.env.SESSION_MAX_AGE_SECONDS, 10)
  : 60 * 60 * 24 // 24 hours default for production

export async function POST(request: NextRequest) {
  const rl = rateLimitResponse(request, AUTH_RATE_LIMIT)
  if (rl) return rl

  const { ipAddress, userAgent } = getRequestMeta(request)

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    const supabase = createClient(url, key)

    const { data: users, error: queryError } = await supabase
      .from("users")
      .select("id, email, password_hash, full_name, role, preferred_language, preferred_currency, company_id, status")
      .eq("email", email.toLowerCase())
      .maybeSingle()

    if (queryError) {
      console.error("[v0] Query error:", queryError)
      await logAccessEvent({ eventType: "login_failure", email: email.toLowerCase(), ipAddress, userAgent, details: { reason: "query_error" } })
      throw queryError
    }

    if (!users) {
      await logAccessEvent({ eventType: "login_failure", email: email.toLowerCase(), ipAddress, userAgent, details: { reason: "user_not_found" } })
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if ((users as { status?: string }).status === "suspended") {
      await logAccessEvent({ eventType: "login_failure", userId: users.id, email: users.email, ipAddress, userAgent, details: { reason: "account_suspended" } })
      return NextResponse.json({ error: "Account is suspended. Contact support." }, { status: 403 })
    }

    const passwordMatch = await bcrypt.compare(password, users.password_hash)

    if (!passwordMatch) {
      await logAccessEvent({ eventType: "login_failure", userId: users.id, email: users.email, ipAddress, userAgent, details: { reason: "invalid_password" } })
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)
    const tokenHash = `hash_${Date.now()}_${Math.random().toString(36).slice(2)}`

    const { data: sessionRow, error: sessionErr } = await supabase
      .from("sessions")
      .insert({
        user_id: users.id,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
        user_agent: userAgent,
        ip_address: ipAddress,
      })
      .select("id")
      .single()

    const sessionToken = sessionRow?.id ?? Buffer.from(`${users.id}:${Date.now()}`).toString("base64")
    if (sessionErr) console.warn("[v0] Session insert (non-critical):", sessionErr)

    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
    })

    await logAccessEvent({ eventType: "login_success", userId: users.id, email: users.email, ipAddress, userAgent })

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
