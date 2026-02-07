import { NextResponse } from "next/server"
import { requireAdmin, requirePermission } from "@/lib/admin-auth"
import { fetchAuditLogs, auditLogsToCSV } from "@/lib/audit"
import { PERMISSIONS } from "@/lib/rbac"

/**
 * GET /api/admin/audit
 * Query params: entityType, action, tenantId, limit, offset, format=csv|json
 * Admin/Auditor only (view_audit_logs / export_audit_logs). Returns immutable audit logs with optional CSV export.
 */
export async function GET(request: Request) {
  const authErr = await requireAdmin()
  if (authErr) return authErr
  const permErr = await requirePermission(PERMISSIONS.VIEW_AUDIT_LOGS)
  if (permErr) return permErr

  const params = new URL(request.url).searchParams
  const entityType = params.get("entityType") || undefined
  const action = params.get("action") || undefined
  const tenantId = params.get("tenantId") || undefined
  const limit = Math.min(500, Math.max(1, parseInt(params.get("limit") || "100", 10)))
  const offset = Math.max(0, parseInt(params.get("offset") || "0", 10))
  const format = params.get("format") || "json"

  try {
    const logs = await fetchAuditLogs({
      entityType,
      action: action as any,
      tenantId,
      limit,
      offset,
    })

    if (format === "csv") {
      const csv = auditLogsToCSV(logs)
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      })
    }

    return NextResponse.json({ logs, total: logs.length })
  } catch (e) {
    console.warn("[audit] Export error:", e)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
