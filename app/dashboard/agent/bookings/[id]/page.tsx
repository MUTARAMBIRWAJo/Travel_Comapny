"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AgentBookingDetailPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/agent/bookings">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to bookings
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Booking details for this booking can be loaded here by ID.</p>
          <Link href={`/dashboard/agent/requests?bookingId=${id}`}>
            <Button variant="outline" size="sm" className="mt-4">Related request</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
