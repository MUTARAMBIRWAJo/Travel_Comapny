/**
 * Phase 7 — Public API: list travel requests (tenant-scoped by API key).
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { resolveApiKey, requireScope } from "@/lib/api-key-auth"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const xApiKey = request.headers.get("x-api-key")
  const resolved = await resolveApiKey(authHeader, xApiKey)

  if (!resolved) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }
  if (!requireScope(resolved, "travel_requests") && !requireScope(resolved, "*")) {
    return NextResponse.json({ error: "Insufficient scope" }, { status: 403 })
  }

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 500 })

  const limit = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") || "20", 10)))
  const offset = Math.max(0, parseInt(request.nextUrl.searchParams.get("offset") || "0", 10))

  const query = supabase
    .from("travel_requests")
    .select("id, user_id, company_id, destination, start_date, end_date, status, budget_usd, created_at", { count: "exact" })
    .eq("company_id", resolved.company_id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    travel_requests: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  })
}
