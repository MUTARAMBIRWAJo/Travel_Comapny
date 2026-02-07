"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default function EmployeeTripsPage() {
  const trips = [
    { id: 1, destination: "Nairobi, Kenya", dates: "Mar 15–21, 2026", status: "approved", budget: "$3,500" },
    { id: 2, destination: "Paris, France", dates: "Apr 1–15, 2026", status: "pending", budget: "$2,800" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Trips</h2>
        <p className="text-muted-foreground">Your approved and upcoming travel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip List</CardTitle>
          <CardDescription>Trips linked to your travel requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <Plane className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {trip.destination}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {trip.dates}
                    </p>
                    <p className="text-xs text-muted-foreground">{trip.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={trip.status === "approved" ? "default" : "secondary"}>
                    {trip.status}
                  </Badge>
                  <Link href={`/dashboard/employee/trips/${trip.id}`}>
                    <Button variant="outline" size="sm">View details</Button>
                  </Link>
                  <Link href={`/dashboard/employee/itineraries?tripId=${trip.id}`}>
                    <Button variant="outline" size="sm">Itinerary</Button>
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
