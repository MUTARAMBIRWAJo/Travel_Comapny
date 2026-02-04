"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function AgentRequestsPage() {
  const requests = [
    {
      id: "REQ001",
      client: "John Traveler",
      destination: "Kenya Safari",
      dates: "Mar 15-21, 2026",
      status: "pending",
      priority: "high",
      createdDate: "Dec 10, 2025",
    },
    {
      id: "REQ002",
      client: "TechCorp Inc",
      destination: "Rwanda Team Retreat",
      dates: "Apr 1-7, 2026",
      status: "approved",
      priority: "medium",
      createdDate: "Dec 8, 2025",
    },
    {
      id: "REQ003",
      client: "Jane Smith",
      destination: "Paris Tour",
      dates: "May 10-20, 2026",
      status: "completed",
      priority: "low",
      createdDate: "Dec 1, 2025",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Travel Requests</h2>
        <p className="text-muted-foreground">Manage assigned client requests</p>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>Total: {requests.length} requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-muted-foreground">{req.id}</span>
                    {getStatusIcon(req.status)}
                  </div>
                  <p className="font-semibold">{req.client}</p>
                  <p className="text-sm text-muted-foreground">{req.destination}</p>
                  <p className="text-xs text-muted-foreground mt-1">{req.dates}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={req.priority === "high" ? "destructive" : "secondary"}>{req.priority}</Badge>
                  <Badge
                    variant={
                      req.status === "completed" ? "default" : req.status === "pending" ? "secondary" : "outline"
                    }
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
