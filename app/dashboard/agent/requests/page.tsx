"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

const statusConfig = {
  draft: { icon: Clock, color: "bg-slate-100 text-slate-800", label: "Draft" },
  submitted: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Submitted" },
  approved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Approved" },
  fulfilled: { icon: CheckCircle, color: "bg-blue-100 text-blue-800", label: "Fulfilled" },
  completed: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-800", label: "Completed" },
  cancelled: { icon: AlertCircle, color: "bg-red-100 text-red-800", label: "Cancelled" },
}

export default function AgentRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/service-requests")
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.log("[v0] Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const updateRequestStatus = async (requestId: string, nextStatus: string) => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/service-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: nextStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data?.error || "Failed to update request")
        return
      }

      await fetchRequests()
    } catch (error) {
      console.log("[v0] Error updating request:", error)
      alert("Failed to update request")
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Travel Requests</h2>
        <p className="text-muted-foreground">Manage assigned client requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>Total: {requests.length} requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests available.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const config = getStatusConfig(req.status)
                const StatusIcon = config.icon
                return (
                  <div key={req.id} className="flex flex-col gap-3 p-4 border rounded-lg md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-muted-foreground">{req.id}</span>
                        <StatusIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="font-semibold">{req.traveller_name || "Unknown traveler"}</p>
                      <p className="text-sm text-muted-foreground">{req.destination || "Destination TBD"}</p>
                      {req.travel_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(req.travel_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={config.color}>{config.label}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoading || req.status !== "approved"}
                        onClick={() => updateRequestStatus(req.id, "fulfilled")}
                      >
                        Mark Fulfilled
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoading || req.status !== "fulfilled"}
                        onClick={() => updateRequestStatus(req.id, "completed")}
                      >
                        Mark Completed
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
