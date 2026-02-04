import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Edit } from "lucide-react"

export default function AdminUsersPage() {
  const users = [
    {
      id: "1",
      name: "John Traveler",
      email: "john.traveler@email.com",
      role: "INDIVIDUAL_TRAVELER",
      status: "active",
      joinedDate: "2025-06-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "agent.sarah@weofyou.com",
      role: "TRAVEL_AGENT",
      status: "active",
      joinedDate: "2025-01-20",
    },
    {
      id: "3",
      name: "Corporate Admin",
      email: "company.admin1@tech.com",
      role: "CORPORATE_CLIENT",
      status: "active",
      joinedDate: "2025-05-10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground">Manage system users and permissions</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>
        <Button className="btn-primary">Add User</Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total: {users.length} users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{user.role.replace(/_/g, " ")}</Badge>
                  <Badge variant="outline">{user.status}</Badge>
                  <span className="text-sm text-muted-foreground">{user.joinedDate}</span>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
