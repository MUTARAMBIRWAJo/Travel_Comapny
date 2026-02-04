"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DatabaseStatus {
  roles: number
  users: number
  companies: number
  destinations: number
  packages: number
  travelRequests: number
  trips: number
  blogPosts: number
  totalRecords: number
  testCredentials: {
    admin: { email: string; password: string }
    agent: { email: string; password: string }
    traveler: { email: string; password: string }
  }
}

interface User {
  id: string
  email: string
  name: string
  role: string
  status: string
  createdAt: string
}

interface Package {
  id: string
  title: string
  category: string
  priceUsd: number
  duration: number
  destination: { name: string; country: string }
  esgScore: number
}

export default function VerifyDatabasePage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch database status
        const statusRes = await fetch("/api/verify-database")
        if (!statusRes.ok) throw new Error("Failed to fetch database status")
        const statusData = await statusRes.json()
        setStatus(statusData.data)

        // Fetch users
        const usersRes = await fetch("/api/verify-database/users")
        if (!usersRes.ok) throw new Error("Failed to fetch users")
        const usersData = await usersRes.json()
        setUsers(usersData.users)

        // Fetch packages
        const packagesRes = await fetch("/api/verify-database/packages")
        if (!packagesRes.ok) throw new Error("Failed to fetch packages")
        const packagesData = await packagesRes.json()
        setPackages(packagesData.packages)

        console.log("[v0] Database verification successful")
      } catch (err) {
        console.error("[v0] Verification error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold">Verifying Database...</div>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Database Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Database Verification</h1>
          <p className="mt-2 text-slate-600">We-Of-You Travel Platform - Data Status</p>
        </div>

        {/* Database Summary */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Database Status</span>
              <Badge className="bg-green-600">Connected</Badge>
            </CardTitle>
            <CardDescription>Total Records: {status?.totalRecords}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {status && (
                <>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.roles}</div>
                    <div className="text-sm text-slate-600">Roles</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.users}</div>
                    <div className="text-sm text-slate-600">Users</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.companies}</div>
                    <div className="text-sm text-slate-600">Companies</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.packages}</div>
                    <div className="text-sm text-slate-600">Packages</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.destinations}</div>
                    <div className="text-sm text-slate-600">Destinations</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.travelRequests}</div>
                    <div className="text-sm text-slate-600">Travel Requests</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.trips}</div>
                    <div className="text-sm text-slate-600">Trips</div>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{status.blogPosts}</div>
                    <div className="text-sm text-slate-600">Blog Posts</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Login Credentials</CardTitle>
            <CardDescription>Use these credentials to test the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {status?.testCredentials && (
                <>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="text-sm font-semibold text-blue-900">Admin</div>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="break-all font-mono">{status.testCredentials.admin.email}</p>
                      <p className="break-all font-mono">{status.testCredentials.admin.password}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <div className="text-sm font-semibold text-purple-900">Travel Agent</div>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="break-all font-mono">{status.testCredentials.agent.email}</p>
                      <p className="break-all font-mono">{status.testCredentials.agent.password}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="text-sm font-semibold text-green-900">Traveler</div>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="break-all font-mono">{status.testCredentials.traveler.email}</p>
                      <p className="break-all font-mono">{status.testCredentials.traveler.password}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Data Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="packages">Packages ({packages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Seeded Users</CardTitle>
                <CardDescription>All users in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono text-xs">{user.email}</td>
                          <td className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          <td className="px-4 py-2">
                            <Badge className={user.status === "active" ? "bg-green-600" : "bg-slate-600"}>
                              {user.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Travel Packages</CardTitle>
                <CardDescription>All available travel packages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {packages.map((pkg) => (
                    <Card key={pkg.id} className="overflow-hidden border-slate-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{pkg.title}</CardTitle>
                            <CardDescription>
                              {pkg.destination?.name}, {pkg.destination?.country}
                            </CardDescription>
                          </div>
                          {pkg.esgScore && <Badge className="bg-green-600">{pkg.esgScore} ESG</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Category:</span>
                          <span className="font-semibold">{pkg.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Price:</span>
                          <span className="font-semibold">${pkg.priceUsd.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Duration:</span>
                          <span className="font-semibold">{pkg.duration} days</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 rounded-lg bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">Next Steps:</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-blue-800">
            <li>All database tables are seeded with sample data</li>
            <li>Use the test credentials above to log in to different dashboards</li>
            <li>
              Visit <code className="rounded bg-blue-100 px-2 py-1">/login</code> to test authentication
            </li>
            <li>Check your dashboards: /dashboard/admin, /dashboard/agent, /dashboard/traveler</li>
            <li>Database is ready for production deployment</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
