"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollText, Download, Filter } from "lucide-react"

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [entityType, setEntityType] = useState("")
  const [action, setAction] = useState("")
  const limit = 20

  const fetchLogs = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (entityType) params.set("entityType", entityType)
    if (action) params.set("action", action)
    try {
      const res = await fetch(`/api/admin/audit?${params}`, { credentials: "include" })
      const data = await res.json()
      if (res.ok) {
        setLogs(data.logs || [])
        setTotal(data.total ?? data.logs?.length ?? 0)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page, entityType, action])

  const exportCsv = () => {
    const params = new URLSearchParams({ format: "csv", limit: "500" })
    if (entityType) params.set("entityType", entityType)
    if (action) params.set("action", action)
    window.open(`/api/admin/audit?${params}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Audit Logs</h2>
        <p className="text-muted-foreground">Immutable log of sensitive actions. Export for compliance.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="w-5 h-5" />
              Logs
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Entity type"
                className="w-40"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              />
              <Input
                placeholder="Action"
                className="w-32"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={() => { setPage(1); fetchLogs(); }}>
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="w-4 h-4 mr-1" /> Export CSV
              </Button>
            </div>
          </div>
          <CardDescription>Total: {total} entries. Logs are immutable and timestamped.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit logs found.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm"
                >
                  <Badge variant="outline">{log.entity_type}</Badge>
                  <Badge>{log.action}</Badge>
                  <span className="text-muted-foreground">{log.entity_id && String(log.entity_id).slice(0, 8)}</span>
                  <span className="text-muted-foreground">
                    {log.created_at ? new Date(log.created_at).toLocaleString() : ""}
                  </span>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {JSON.stringify(log.metadata)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-between">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button variant="outline" size="sm" disabled={logs.length < limit} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
