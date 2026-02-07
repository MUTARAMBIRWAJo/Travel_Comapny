import { createClient } from "@supabase/supabase-js"

export type AccessEventType = "login_success" | "login_failure" | "logout" | "admin_action" | "auth_check"

export interface AccessLogInput {
  eventType: AccessEventType
  userId?: string | null
  email?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  resource?: string | null
  details?: Record<string, unknown>
}

export async function logAccessEvent(input: AccessLogInput): Promise<void> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return

    const supabase = createClient(url, key)
    await supabase.from("access_logs").insert({
      event_type: input.eventType,
      user_id: input.userId || null,
      email: input.email || null,
      ip_address: input.ipAddress || null,
      user_agent: input.userAgent || null,
      resource: input.resource || null,
      details: input.details || {},
    })
  } catch (e) {
    console.warn("[access-log] Failed to write:", e)
  }
}

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  return forwarded?.split(",")[0]?.trim() || realIp || null
}

function getUserAgent(request: Request): string | null {
  return request.headers.get("user-agent") || null
}

export function getRequestMeta(request: Request): { ipAddress: string | null; userAgent: string | null } {
  return { ipAddress: getClientIp(request), userAgent: getUserAgent(request) }
}
