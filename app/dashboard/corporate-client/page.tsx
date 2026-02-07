"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, DollarSign, Leaf } from "lucide-react"

export default function CorporateClientDashboard() {
  const employees = [
    { id: 1, name: "Alice Johnson", email: "alice@techcorp.com", role: "Manager", tripsBooked: 5 },
    { id: 2, name: "Bob Smith", email: "bob@techcorp.com", role: "Developer", tripsBooked: 2 },
    { id: 3, name: "Carol White", email: "carol@techcorp.com", role: "Designer", tripsBooked: 3 },
  ]

  const stats = [
    { label: "Active Employees", value: "45", icon: Users },
    { label: "Total Trips Booked", value: "127", icon: TrendingUp },
    { label: "Travel Budget Used", value: "$84,500", icon: DollarSign },
    { label: "Carbon Offset (kg)", value: "12,450", icon: Leaf },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Company Travel Management</h2>
        <p className="text-muted-foreground">Manage employee travel and analytics</p>
      </div>

      {/* Stats */}
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
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Your company&apos;s registered travelers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-sm text-muted-foreground">{emp.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{emp.role}</span>
                  <span className="text-sm font-medium">{emp.tripsBooked} trips</span>
                  <Link href="/dashboard/corporate-client/employees">
                    <Button variant="outline" size="sm">View</Button>
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
