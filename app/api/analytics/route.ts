import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-auth"

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
      const authErr = await requireAdmin()
      if (authErr) return authErr

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

            const { count: travelRequestsCount } = await supabase
                  .from("travel_requests")
                  .select("id", { count: "exact", head: true })

            const { data: travelByStatus } = await supabase
                  .from("travel_requests")
                  .select("status")

            const statusCounts: Record<string, number> = {}
            ;(travelByStatus || []).forEach((r: { status: string }) => {
                  statusCounts[r.status] = (statusCounts[r.status] || 0) + 1
            })

            const { data: serviceRequests } = await supabase
                  .from("service_requests")
                  .select("id, status, destination, budget_usd, created_at, approved_at")
                  .order("created_at", { ascending: false })
                  .limit(500)

            const approvedWithTime = (serviceRequests || []).filter(
                  (r: { approved_at?: string }) => r.approved_at
            )
            const avgApprovalHours =
                  approvedWithTime.length > 0
                        ? approvedWithTime.reduce((sum: number, r: { approved_at?: string; created_at?: string }) => {
                              const created = new Date(r.created_at || 0).getTime()
                              const approved = new Date(r.approved_at || 0).getTime()
                              return sum + (approved - created) / (1000 * 60 * 60)
                            }, 0) / approvedWithTime.length
                        : null

            const topDestinations: Record<string, number> = {}
            ;(serviceRequests || []).forEach((r: { destination?: string }) => {
                  const d = (r.destination || "Unknown").trim()
                  topDestinations[d] = (topDestinations[d] || 0) + 1
            })
            const topDestinationsList = Object.entries(topDestinations)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([name, count]) => ({ name, count }))

            const stats = [
                  { label: "Total Revenue", value: revenueTotal, change: "" },
                  { label: "New Users", value: totalUsers || 0, change: "" },
                  { label: "Total Trips", value: totalTrips || 0, change: "" },
                  {
                        label: "Avg Trip Value",
                        value: totalTrips ? revenueTotal / totalTrips : 0,
                        change: "",
                  },
                  { label: "Travel Requests", value: travelRequestsCount || 0, change: "" },
                  {
                        label: "Avg Approval Time (hrs)",
                        value: avgApprovalHours != null ? Math.round(avgApprovalHours * 10) / 10 : "—",
                        change: "",
                  },
            ]

            return NextResponse.json({
                  stats,
                  monthlyData,
                  requestStatusBreakdown: statusCounts,
                  topDestinations: topDestinationsList,
            })
      } catch (error) {
            console.error("[v0] Error in GET /api/analytics:", error)
            return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
      }
}