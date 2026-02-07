"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function EmployeeRequestsPage() {
  const requests = [
    { id: 1, destination: "Nairobi", travelDate: "Mar 15, 2026", status: "approved" },
    { id: 2, destination: "Paris", travelDate: "Apr 1, 2026", status: "pending" },
  ]

  const getStatusBadge = (status: string) => {
    if (status === "approved") return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>
    return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Travel Requests</h2>
        <p className="text-muted-foreground">Your submitted travel requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>Request status and next steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{r.destination}</p>
                    <p className="text-sm text-muted-foreground">Travel date: {r.travelDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(r.status)}
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
