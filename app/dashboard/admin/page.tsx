import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, TrendingUp, AlertCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default async function AdminDashboard() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const [usersResp, tripsResp, requestsResp, companiesResp, invoicesResp] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("trips").select("id", { count: "exact", head: true }),
    supabase.from("travel_requests").select("id", { count: "exact", head: true }),
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("invoices").select("amount"),
  ])

  const userCount = usersResp.count || 0
  const tripCount = tripsResp.count || 0
  const requestCount = requestsResp.count || 0
  const companies = companiesResp.count || 0
  const totalRevenue = (invoicesResp.data || []).reduce((sum, inv) => sum + (inv.amount || 0), 0)

  const stats = [
    { label: "Total Users", value: userCount.toLocaleString(), icon: Users, change: "+12%" },
    { label: "Active Trips", value: tripCount.toLocaleString(), icon: TrendingUp, change: "+5%" },
    { label: "Revenue (Total)", value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, change: "+22%" },
    { label: "Companies", value: companies.toLocaleString(), icon: AlertCircle, change: "Active" },
  ]

  // Get recent requests
  const { data: recentRequests } = await supabase
    .from("travel_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats Grid */}
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
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Travel Requests</CardTitle>
          <CardDescription>Latest requests from users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(recentRequests || []).map((request, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{request.destination}</p>
                  <p className="text-sm text-muted-foreground">Status: {request.status}</p>
                </div>
                <p className="text-sm">${request.budget_usd}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
