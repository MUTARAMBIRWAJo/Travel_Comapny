"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Calendar, DollarSign, FileText } from "lucide-react"

export default function EmployeeDashboard() {
  const myTrips = [
    {
      id: 1,
      destination: "Nairobi, Kenya",
      dates: "Mar 15-21, 2026",
      status: "approved",
      budget: "$3,500",
    },
    {
      id: 2,
      destination: "Paris, France",
      dates: "Apr 1-15, 2026",
      status: "pending",
      budget: "$2,800",
    },
  ]

  const stats = [
    { label: "Upcoming Trips", value: "2", icon: Plane },
    { label: "Days Until Next Trip", value: "87", icon: Calendar },
    { label: "Budget Remaining", value: "$6,200", icon: DollarSign },
    { label: "Travel Requests", value: "5", icon: FileText },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Travel Portal</h2>
        <p className="text-muted-foreground">Manage your corporate travel requests</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* My Trips */}
      <Card>
        <CardHeader>
          <CardTitle>My Trips</CardTitle>
          <CardDescription>Your approved and pending travel requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{trip.destination}</p>
                  <p className="text-sm text-muted-foreground">{trip.dates}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-secondary">{trip.budget}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      trip.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {trip.status.toUpperCase()}
                  </span>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button size="lg" className="btn-primary">
        Create New Travel Request
      </Button>
    </div>
  )
}
