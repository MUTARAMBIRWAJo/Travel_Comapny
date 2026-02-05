import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return null
      return createClient(url, key)
}

function getMonthLabel(date: Date) {
      return date.toLocaleString("en-US", { month: "short" })
}

export async function GET() {
      try {
            const supabase = getSupabase()
            if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

            const now = new Date()
            const months: { label: string; start: string; end: string }[] = []
            for (let i = 5; i >= 0; i -= 1) {
                  const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
                  const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
                  months.push({
                        label: getMonthLabel(start),
                        start: start.toISOString(),
                        end: end.toISOString(),
                  })
            }

            const { count: totalUsers } = await supabase
                  .from("users")
                  .select("id", { count: "exact", head: true })

            const { count: totalTrips } = await supabase
                  .from("trips")
                  .select("id", { count: "exact", head: true })

            const { data: tripsRevenue } = await supabase
                  .from("trips")
                  .select("total_cost_usd")
                  .not("total_cost_usd", "is", null)

            const revenueTotal = (tripsRevenue || []).reduce(
                  (sum, trip) => sum + (Number(trip.total_cost_usd) || 0),
                  0,
            )

            const monthlyData = await Promise.all(
                  months.map(async (month) => {
                        const { count: users } = await supabase
                              .from("users")
                              .select("id", { count: "exact", head: true })
                              .gte("created_at", month.start)
                              .lt("created_at", month.end)

                        const { count: bookings } = await supabase
                              .from("trips")
                              .select("id", { count: "exact", head: true })
                              .gte("created_at", month.start)
                              .lt("created_at", month.end)

                        const { data: revenueRows } = await supabase
                              .from("trips")
                              .select("total_cost_usd")
                              .gte("created_at", month.start)
                              .lt("created_at", month.end)

                        const revenue = (revenueRows || []).reduce(
                              (sum, row) => sum + (Number(row.total_cost_usd) || 0),
                              0,
                        )

                        return {
                              month: month.label,
                              users: users || 0,
                              bookings: bookings || 0,
                              revenue,
                        }
                  })
            )

            const stats = [
                  { label: "Total Revenue", value: revenueTotal, change: "" },
                  { label: "New Users", value: totalUsers || 0, change: "" },
                  { label: "Total Trips", value: totalTrips || 0, change: "" },
                  {
                        label: "Avg Trip Value",
                        value: totalTrips ? revenueTotal / totalTrips : 0,
                        change: "",
                  },
            ]

            return NextResponse.json({
                  stats,
                  monthlyData,
            })
      } catch (error) {
            console.error("[v0] Error in GET /api/analytics:", error)
            return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
      }
}