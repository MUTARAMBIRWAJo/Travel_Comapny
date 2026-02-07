"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingDown, Recycle } from "lucide-react"

export default function CorporateClientESGPage() {
  const metrics = [
    { label: "Carbon Footprint (tCO2e)", value: "24.5", change: "-12% vs last year", icon: Leaf },
    { label: "Offset Projects", value: "3", description: "Verified offset programs", icon: Recycle },
    { label: "Sustainable Trips %", value: "68%", description: "Trips with eco options", icon: TrendingDown },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">ESG Reports</h2>
        <p className="text-muted-foreground">Environmental, social and governance travel metrics</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{m.label}</CardTitle>
                <Icon className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{m.value}</div>
                {m.change && <p className="text-xs text-muted-foreground">{m.change}</p>}
                {m.description && <p className="text-xs text-muted-foreground mt-1">{m.description}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sustainability Summary</CardTitle>
          <CardDescription>Travel-related ESG data for reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Use this section for carbon tracking, offset programs, and sustainable travel policy compliance.
            Export data for your annual ESG or sustainability reports.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
