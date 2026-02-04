"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, MapPin, Calendar } from "lucide-react"

export default function TripsPage() {
  const trips = [
    {
      id: 1,
      destination: "Paris, France",
      dates: "Apr 1-15, 2026",
      status: "confirmed",
      price: "$2,800",
      invoice: "INV-2026-001",
    },
    {
      id: 2,
      destination: "Rwanda",
      dates: "May 20-27, 2026",
      status: "pending",
      price: "$4,200",
      invoice: "INV-2026-002",
    },
    {
      id: 3,
      destination: "Kenya Safari",
      dates: "Mar 15-21, 2026",
      status: "completed",
      price: "$3,500",
      invoice: "INV-2026-003",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Trips</h2>
        <p className="text-muted-foreground">View and manage all your bookings</p>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <h3 className="font-semibold text-lg">{trip.destination}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.dates}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Invoice: {trip.invoice}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">{trip.price}</p>
                    <Badge
                      variant={
                        trip.status === "confirmed" ? "default" : trip.status === "pending" ? "secondary" : "outline"
                      }
                    >
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
