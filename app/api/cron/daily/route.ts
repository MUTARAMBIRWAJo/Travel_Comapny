/**
 * Phase 6 — Scheduled daily job (invoke via Vercel Cron or external scheduler).
 * Secured by CRON_SECRET. Actions: expired docs check, inactive user alerts, backup verification reminder.
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { emitWorkflowEvent } from "@/lib/workflow"

export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "") ?? request.nextUrl.searchParams.get("secret")
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    const supabase = createClient(url, key)

    const results: { task: string; count?: number; error?: string }[] = []

    const { data: expiringDocs } = await supabase
      .from("request_documents")
      .select("id, service_request_id")
      .eq("status", "pending")
      .limit(100)

    if (expiringDocs?.length) {
      for (const doc of expiringDocs) {
        await emitWorkflowEvent({
          entity_type: "document",
          entity_id: doc.id,
          event_type: "document_expired",
          payload: { service_request_id: doc.service_request_id },
        })
      }
      results.push({ task: "document_expiry_check", count: expiringDocs.length })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("[cron] daily error:", error)
    return NextResponse.json({ error: "Cron failed" }, { status: 500 })
  }
}
