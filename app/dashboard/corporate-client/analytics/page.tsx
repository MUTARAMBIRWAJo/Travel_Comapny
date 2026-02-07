"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, DollarSign, Plane, Leaf } from "lucide-react"

export default function CorporateClientAnalyticsPage() {
  const stats = [
    { label: "Total Trips (YTD)", value: "127", icon: Plane },
    { label: "Travel Spend (YTD)", value: "$84,500", icon: DollarSign },
    { label: "Avg. per Trip", value: "$665", icon: TrendingUp },
    { label: "Carbon Offset (kg)", value: "12,450", icon: Leaf },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">Company travel metrics and insights</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Travel Overview
          </CardTitle>
          <CardDescription>Summary of corporate travel activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Detailed charts and breakdowns by department, destination, and period can be added here.
            Connect to your travel and expense data for live analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
