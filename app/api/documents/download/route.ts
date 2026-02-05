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
            const path = request.nextUrl.searchParams.get("path")

            if (!path) {
                  return NextResponse.json({ error: "Document path is required" }, { status: 400 })
            }

            const supabase = getSupabase()
            if (!supabase) {
                  return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
            }

            const { data, error } = await supabase.storage
                  .from("service-documents")
                  .download(path)

            if (error || !data) {
                  console.error("[v0] Error downloading document:", error)
                  return NextResponse.json({ error: "Failed to download document" }, { status: 500 })
            }

            const buffer = Buffer.from(await data.arrayBuffer())
            const filename = path.split("/").pop() || "document.pdf"

            return new NextResponse(buffer, {
                  status: 200,
                  headers: {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": `attachment; filename=\"${filename}\"`,
                  },
            })
      } catch (error) {
            console.error("[v0] Error in GET /api/documents/download:", error)
            return NextResponse.json({ error: "Failed to download document" }, { status: 500 })
      }
}