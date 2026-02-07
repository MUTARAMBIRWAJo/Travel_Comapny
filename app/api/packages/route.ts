import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest } from "next/server"
import { rateLimitResponse, DEFAULT_PUBLIC_LIMIT } from "@/lib/rate-limit-api"
import { getCached, setCached, cacheKey } from "@/lib/cache"

const CACHE_TTL = 60

export async function GET(request: NextRequest) {
  const rl = rateLimitResponse(request, DEFAULT_PUBLIC_LIMIT)
  if (rl) return rl

  const cached = getCached<{ success: true; packages: unknown[] }>(cacheKey("api", "packages"))
  if (cached) {
    const res = NextResponse.json(cached)
    res.headers.set("Cache-Control", "public, max-age=60, s-maxage=120")
    return res
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    const supabase = createClient(url, key)

    const { data: packages, error } = await supabase.from("travel_packages").select("*").limit(50)

    if (error) throw error

    const payload = { success: true as const, packages: packages || [] }
    setCached(cacheKey("api", "packages"), payload, CACHE_TTL)

    const res = NextResponse.json(payload)
    res.headers.set("Cache-Control", "public, max-age=60, s-maxage=120")
    return res
  } catch (error) {
    console.error("[v0] Get packages error:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}
