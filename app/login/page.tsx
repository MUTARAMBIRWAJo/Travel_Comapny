"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        // Ensure the browser stores/sends the httpOnly session cookie
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        return
      }

      const role = (data.user.role || "").toString().toLowerCase()

      const roleDashboards: Record<string, string> = {
        admin: "/dashboard/admin",
        administrator: "/dashboard/admin",
        travel_agent: "/dashboard/agent",
        agent: "/dashboard/agent",
        corporate_client: "/dashboard/corporate-client",
        corporate_employee: "/dashboard/employee",
        employee: "/dashboard/employee",
        traveler: "/dashboard/traveler",
        individual_traveler: "/dashboard/traveler",
      }

      const dashboard = roleDashboards[role] || "/dashboard/traveler"
      router.push(dashboard)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Welcome back to We-Of-You Travel</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                {"Don't have an account? "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg text-xs space-y-2">
              <p className="font-semibold">Test Credentials:</p>
              <div className="space-y-1">
                <p>👤 Traveler: john.traveler@email.com</p>
                <p>🛫 Agent: agent.sarah@weofyou.com</p>
                <p>🏢 Corporate: company.admin1@tech.com</p>
                <p>👨‍💼 Employee: employee1@tech.com</p>
                <p>⚙️ Admin: admin@weofyou.com</p>
                <p className="text-muted-foreground mt-2">Password: password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </>
  )
}
