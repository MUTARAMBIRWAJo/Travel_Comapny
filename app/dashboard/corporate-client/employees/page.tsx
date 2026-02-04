import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2 } from "lucide-react"

export default function EmployeesPage() {
  const employees = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@techcorp.com",
      department: "Engineering",
      status: "active",
      tripsBooked: 5,
      spentAmount: "$8,500",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@techcorp.com",
      department: "Sales",
      status: "active",
      tripsBooked: 12,
      spentAmount: "$22,450",
    },
    {
      id: "3",
      name: "Carol White",
      email: "carol@techcorp.com",
      department: "HR",
      status: "inactive",
      tripsBooked: 3,
      spentAmount: "$4,200",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Employees</h2>
          <p className="text-muted-foreground">Manage your company travelers</p>
        </div>
        <Button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search employees..." className="pl-9" />
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Total: {employees.length} employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-sm text-muted-foreground">{emp.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{emp.department}</span>
                  <span className="text-sm font-medium">{emp.tripsBooked} trips</span>
                  <span className="text-sm font-medium text-secondary">{emp.spentAmount}</span>
                  <Badge variant={emp.status === "active" ? "default" : "secondary"}>{emp.status}</Badge>
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
