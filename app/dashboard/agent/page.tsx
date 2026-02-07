"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Users, CheckCircle, Clock } from "lucide-react"

export default function AgentDashboard() {
  const assignedRequests = [
    {
      id: 1,
      clientName: "John Traveler",
      destination: "Kenya Safari",
      status: "pending",
      dueDate: "Dec 20, 2025",
    },
    {
      id: 2,
      clientName: "TechCorp Inc",
      destination: "Rwanda Team Retreat",
      status: "approved",
      dueDate: "Dec 25, 2025",
    },
    {
      id: 3,
      clientName: "Jane Smith",
      destination: "Paris Cultural Tour",
      status: "completed",
      dueDate: "Dec 18, 2025",
    },
  ]

  const stats = [
    { label: "Assigned Requests", value: "24", icon: ClipboardList, color: "text-blue-500" },
    { label: "Active Clients", value: "12", icon: Users, color: "text-purple-500" },
    { label: "Completed Bookings", value: "87", icon: CheckCircle, color: "text-green-500" },
    { label: "Pending Actions", value: "8", icon: Clock, color: "text-orange-500" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Travel Agent Dashboard</h2>
        <p className="text-muted-foreground">Manage client requests and bookings</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Assigned Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Travel Requests</CardTitle>
          <CardDescription>Requests requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assignedRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-semibold">{req.clientName}</p>
                  <p className="text-sm text-muted-foreground">{req.destination}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      req.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : req.status === "approved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </span>
                  <Link href="/dashboard/agent/requests">
                    <Button variant="outline" size="sm">Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
