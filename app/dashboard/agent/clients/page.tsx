"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mail, Plane } from "lucide-react"
import Link from "next/link"

export default function AgentClientsPage() {
  const clients = [
    { id: 1, name: "John Traveler", email: "john@example.com", requestsCount: 3 },
    { id: 2, name: "TechCorp Inc", email: "travel@techcorp.com", requestsCount: 8 },
    { id: 3, name: "Jane Smith", email: "jane@example.com", requestsCount: 2 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Clients</h2>
        <p className="text-muted-foreground">Clients linked to your assigned requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Clients</CardTitle>
          <CardDescription>Contact and request history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clients.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {c.email}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5" /> {c.requestsCount} request(s)
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/agent/messages">
                  <Button variant="outline" size="sm">Message</Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
