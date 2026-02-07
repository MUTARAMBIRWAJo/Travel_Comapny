"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function AgentBookingsPage() {
  const bookings = [
    { id: 1, clientName: "John Traveler", destination: "Nairobi Safari", dates: "Mar 15–21, 2026", status: "confirmed" },
    { id: 2, clientName: "TechCorp Inc", destination: "Rwanda Retreat", dates: "Apr 1–5, 2026", status: "pending" },
    { id: 3, clientName: "Jane Smith", destination: "Paris Cultural Tour", dates: "May 10–18, 2026", status: "confirmed" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Bookings</h2>
        <p className="text-muted-foreground">Manage client bookings and itineraries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Bookings linked to your assigned requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{b.clientName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {b.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">{b.dates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={b.status === "confirmed" ? "default" : "secondary"}>
                    {b.status === "confirmed" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {b.status}
                  </Badge>
                  <Link href={`/dashboard/agent/bookings/${b.id}`}>
                    <Button variant="outline" size="sm">View details</Button>
                  </Link>
                  <Link href={`/dashboard/agent/requests?bookingId=${b.id}`}>
                    <Button variant="ghost" size="sm">Request</Button>
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
