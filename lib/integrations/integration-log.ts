/**
 * Phase 7 — Log all external integration calls for audit and debugging.
 */

import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function logIntegrationCall(
  provider: string,
  operation: string,
  status: "success" | "failure" | "timeout" | "skipped",
  requestSummary?: Record<string, unknown>,
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.from("integration_logs").insert({
      provider,
      operation,
      status,
      request_payload: requestSummary || null,
      response_summary: status === "success" ? requestSummary || null : null,
      error_message: errorMessage || null,
    })
  } catch (e) {
    console.warn("[integration-log] Failed to write log:", e)
  }
}
