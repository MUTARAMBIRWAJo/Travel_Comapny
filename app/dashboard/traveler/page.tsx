import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, DollarSign, Leaf } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export default async function TravelerDashboard() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  let userId: string | null = null

  if (sessionToken) {
    const { data: session } = await supabase.from("sessions").select("user_id").eq("token", sessionToken).single()
    if (session) {
      userId = session.user_id
    }
  }

  let upcomingTrips = []
  let tripCount = 0
  let totalMiles = 0
  let totalSpent = 0
  let carbonOffset = 0

  if (userId) {
    const { data: trips } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (trips) {
      upcomingTrips = trips.slice(0, 3).map((trip) => ({
        id: trip.id,
        destination: trip.destination || "Unknown",
        startDate: trip.start_date || "TBD",
        endDate: trip.end_date || "TBD",
        status: trip.status,
      }))

      tripCount = trips.length
      totalSpent = trips.reduce((sum, trip) => sum + (trip.budget_usd || 0), 0)
      carbonOffset = trips.reduce((sum, trip) => sum + (trip.carbon_offset || 0), 0)
      totalMiles = tripCount * 3500
    }
  }

  const quickStats = [
    { label: "Total Trips", value: tripCount.toString(), icon: Plane },
    { label: "Miles Traveled", value: totalMiles.toLocaleString(), icon: Plane },
    { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: DollarSign },
    { label: "Carbon Offset", value: `${Math.round(carbonOffset / 1000)} tonnes`, icon: Leaf },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Travels</h2>
        <p className="text-muted-foreground">View and manage your travel history</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => {
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

      {/* Upcoming Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
          <CardDescription>Your travel history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTrips.length === 0 ? (
              <p className="text-muted-foreground">No trips yet. Start planning your next adventure!</p>
            ) : (
              upcomingTrips.map((trip) => (
                <div key={trip.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{trip.destination}</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.startDate} to {trip.endDate}
                    </p>
                  </div>
                  <Badge>{trip.status}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
