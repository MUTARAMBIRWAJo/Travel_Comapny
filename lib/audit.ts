import { createClient } from "@supabase/supabase-js"

export type AuditAction = "status_changed" | "approved" | "rejected" | "document_uploaded"

export interface AuditLogInput {
      entityType: string
      entityId: string
      action: AuditAction
      actorId?: string | null
      fromStatus?: string | null
      toStatus?: string | null
      metadata?: Record<string, unknown>
}

export async function logAuditEvent({
      entityType,
      entityId,
      action,
      actorId,
      fromStatus,
      toStatus,
      metadata,
}: AuditLogInput) {
      try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY
            if (!url || !key) return

            const supabase = createClient(url, key)

            await supabase.from("audit_logs").insert({
                  entity_type: entityType,
                  entity_id: entityId,
                  action,
                  actor_id: actorId || null,
                  from_status: fromStatus || null,
                  to_status: toStatus || null,
                  metadata: metadata || {},
            })
      } catch (error) {
            console.warn("[v0] Failed to write audit log:", error)
      }
}