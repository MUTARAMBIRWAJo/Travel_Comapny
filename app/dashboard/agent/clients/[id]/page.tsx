"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AgentClientDetailPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/agent/clients">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to clients
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Client details can be loaded here by ID.</p>
          <Link href={`/dashboard/agent/messages?clientId=${id}`}>
            <Button variant="outline" size="sm" className="mt-4">Message client</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
