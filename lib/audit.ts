import { createClient } from "@supabase/supabase-js"

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "status_changed"
  | "approved"
  | "rejected"
  | "payment"
  | "policy_override"
  | "document_uploaded"
  | "suspend"
  | "activate"

export interface AuditLogInput {
  tenantId?: string | null
  entityType: string
  entityId?: string | null
  action: AuditAction
  performedBy?: string | null
  actorId?: string | null
  fromStatus?: string | null
  toStatus?: string | null
  metadata?: Record<string, unknown>
}

/**
 * Write an immutable audit log entry.
 * - Uses service role key (server-side) to insert into audit_logs.
 * - Accepts legacy fields (actorId, fromStatus, toStatus) and maps them to DB columns.
 */
export async function logAuditEvent({
  tenantId,
  entityType,
  entityId,
  action,
  performedBy,
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

    const payload: Record<string, unknown> = {
      tenant_id: tenantId || null,
      entity_type: entityType,
      entity_id: entityId || null,
      action,
      metadata: metadata || {},
    }

    // Provide both legacy and new fields where available; DB accepts matching columns.
    if (performedBy) payload["performed_by"] = performedBy
    if (actorId) payload["actor_id"] = actorId
    if (fromStatus) payload["from_status"] = fromStatus
    if (toStatus) payload["to_status"] = toStatus

    await supabase.from("audit_logs").insert(payload)
  } catch (error) {
    console.warn("[audit] Failed to write audit log:", error)
  }
}

/**
 * Fetch audit logs (server-side). Supports basic filtering and pagination.
 * Uses range(start, end) for PostgREST-compatible pagination.
 */
export async function fetchAuditLogs({
  tenantId,
  action,
  entityType,
  limit = 100,
  offset = 0,
}: {
  tenantId?: string | null
  action?: AuditAction
  entityType?: string | null
  limit?: number
  offset?: number
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase not configured")

  const supabase = createClient(url, key)
  let builder = supabase.from("audit_logs").select("*").order("created_at", { ascending: false })
  if (tenantId) builder = builder.eq("tenant_id", tenantId)
  if (action) builder = builder.eq("action", action)
  if (entityType) builder = builder.eq("entity_type", entityType)

  // Use range(start, end) for pagination
  const start = offset
  const end = Math.max(0, offset + limit - 1)
  const { data, error } = await builder.range(start, end)
  if (error) throw error
  return data
}

/**
 * Convert audit logs to CSV for export (minimal implementation).
 */
export function auditLogsToCSV(logs: any[]) {
  const headers = [
    "id",
    "tenant_id",
    "entity_type",
    "entity_id",
    "action",
    "performed_by",
    "actor_id",
    "from_status",
    "to_status",
    "metadata",
    "created_at",
  ]
  const rows = logs.map((l) =>
    headers
      .map((h) => {
        let v = l[h] ?? l[h.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] ?? ""
        if (h === "metadata" && v && typeof v === "object") v = JSON.stringify(v)
        return `"${String(v).replace(/"/g, '""')}"`
      })
      .join(","),
  )
  return [headers.join(","), ...rows].join("\n")
}