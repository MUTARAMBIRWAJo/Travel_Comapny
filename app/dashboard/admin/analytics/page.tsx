"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AdminAnalyticsPage() {
  const monthlyData = [
    { month: "Jan", users: 120, bookings: 40, revenue: 2400 },
    { month: "Feb", users: 250, bookings: 60, revenue: 3600 },
    { month: "Mar", users: 380, bookings: 85, revenue: 5100 },
    { month: "Apr", users: 520, bookings: 120, revenue: 7200 },
    { month: "May", users: 680, bookings: 156, revenue: 9300 },
    { month: "Jun", users: 850, bookings: 195, revenue: 11700 },
  ]

  const stats = [
    { label: "Total Revenue", value: "$39,300", change: "+18.5%" },
    { label: "New Users", value: "730", change: "+12.3%" },
    { label: "Conversion Rate", value: "23.2%", change: "+2.1%" },
    { label: "Avg Trip Value", value: "$2,850", change: "+8.7%" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">System performance and business metrics</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#00AEEF" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings & Users</CardTitle>
          <CardDescription>Growth comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#004080" />
              <Bar dataKey="bookings" fill="#00AEEF" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
