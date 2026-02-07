"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Clock, CheckCircle } from "lucide-react"

export default function CorporateClientRequestsPage() {
  const requests = [
    { id: 1, employee: "Alice Johnson", destination: "Nairobi", dates: "Mar 15–21, 2026", status: "approved" },
    { id: 2, employee: "Bob Smith", destination: "Paris", dates: "Apr 1–10, 2026", status: "pending" },
    { id: 3, employee: "Carol White", destination: "Dubai", dates: "May 5–12, 2026", status: "in_progress" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Travel Requests</h2>
        <p className="text-muted-foreground">Company travel requests and approvals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Travel Requests</CardTitle>
          <CardDescription>Review and track requests from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{r.employee}</p>
                    <p className="text-sm text-muted-foreground">{r.destination} · {r.dates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(r.status)}
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
