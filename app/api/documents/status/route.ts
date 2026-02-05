import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { logAuditEvent } from "@/lib/audit"

function getSupabase() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return null
      return createClient(url, key)
}

export async function PATCH(request: NextRequest) {
      try {
            const body = await request.json()
            const { id, status, rejectionReason, verifiedBy } = body

            if (!id || !status) {
                  return NextResponse.json({ error: "Document ID and status are required" }, { status: 400 })
            }

            const supabase = getSupabase()
            if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

            const updatePayload: Record<string, unknown> = {
                  status,
                  updated_at: new Date().toISOString(),
            }

            if (status === "verified") {
                  updatePayload.verified_by = verifiedBy || null
                  updatePayload.verified_at = new Date().toISOString()
            }

            if (status === "rejected") {
                  updatePayload.rejection_reason = rejectionReason || "Rejected"
            }

            const { data, error } = await supabase
                  .from("request_documents")
                  .update(updatePayload)
                  .eq("id", id)
                  .select("*, service_request:service_requests(id, traveller_name, traveller_email)")
                  .single()

            if (error) {
                  console.error("[v0] Error updating document:", error)
                  return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
            }

            await logAuditEvent({
                  entityType: "document",
                  entityId: id,
                  action: "status_changed",
                  actorId: verifiedBy || null,
                  metadata: { status },
            })

            return NextResponse.json({ success: true, document: data })
      } catch (error) {
            console.error("[v0] Error in PATCH /api/documents/status:", error)
            return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
      }
}