import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return null
      return createClient(url, key)
}

export async function GET(request: NextRequest) {
      try {
            const status = request.nextUrl.searchParams.get("status")
            const serviceRequestId = request.nextUrl.searchParams.get("serviceRequestId")
            const supabase = getSupabase()

            if (!supabase) {
                  return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
            }

            let query = supabase
                  .from("request_documents")
                  .select("*, service_request:service_requests(id, traveller_name, traveller_email)")
                  .order("created_at", { ascending: false })

            if (status) {
                  query = query.eq("status", status)
            }

            if (serviceRequestId) {
                  query = query.eq("service_request_id", serviceRequestId)
            }

            const { data, error } = await query

            if (error) {
                  console.error("[v0] Error fetching documents:", error)
                  return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
            }

            return NextResponse.json({ documents: data || [] })
      } catch (error) {
            console.error("[v0] Error in GET /api/documents/list:", error)
            return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
      }
}