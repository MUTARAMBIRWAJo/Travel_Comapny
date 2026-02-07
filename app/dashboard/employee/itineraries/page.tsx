"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plane, Hotel, MapPin } from "lucide-react"
import Link from "next/link"

export default function EmployeeItinerariesPage() {
  const itineraries = [
    { id: 1, trip: "Nairobi, Kenya", dates: "Mar 15–21, 2026", flights: "KGL–NBO", hotel: "Safari Lodge" },
    { id: 2, trip: "Paris, France", dates: "Apr 1–15, 2026", flights: "KGL–CDG", hotel: "TBD" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Itineraries</h2>
        <p className="text-muted-foreground">Your trip itineraries and booking details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Trip Itineraries
          </CardTitle>
          <CardDescription>Flights, hotels, and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {itineraries.map((it) => (
              <div
                key={it.id}
                className="p-4 border rounded-lg hover:bg-muted/50 space-y-2"
              >
                <p className="font-semibold">{it.trip}</p>
                <p className="text-sm text-muted-foreground">{it.dates}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Plane className="w-4 h-4" /> {it.flights}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hotel className="w-4 h-4" /> {it.hotel}
                  </span>
                </div>
                <Link href="/dashboard/employee/trips">
                  <Button variant="outline" size="sm" className="mt-2">View Trip</Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
