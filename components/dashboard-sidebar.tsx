"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Plane, BarChart3, MessageSquare, Leaf, Shield, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const dashboardNavs = {
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/dashboard/admin/users", icon: Users },
    { label: "Role Management", href: "/dashboard/admin/roles", icon: Shield },
    { label: "Organizations", href: "/dashboard/admin/organizations", icon: Building },
    { label: "Content", href: "/dashboard/admin/content", icon: FileText },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
  agent: [
    { label: "Dashboard", href: "/dashboard/agent", icon: LayoutDashboard },
    { label: "Travel Requests", href: "/dashboard/agent/requests", icon: Plane },
    { label: "Bookings", href: "/dashboard/agent/bookings", icon: FileText },
    { label: "Clients", href: "/dashboard/agent/clients", icon: Users },
    { label: "Messages", href: "/dashboard/agent/messages", icon: MessageSquare },
  ],
  "corporate-client": [
    { label: "Dashboard", href: "/dashboard/corporate-client", icon: LayoutDashboard },
    { label: "Employees", href: "/dashboard/corporate-client/employees", icon: Users },
    { label: "Travel Requests", href: "/dashboard/corporate-client/requests", icon: Plane },
    { label: "Analytics", href: "/dashboard/corporate-client/analytics", icon: BarChart3 },
    { label: "ESG Reports", href: "/dashboard/corporate-client/esg", icon: Leaf },
    { label: "Settings", href: "/dashboard/corporate-client/settings", icon: Settings },
  ],
  employee: [
    { label: "Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
    { label: "My Trips", href: "/dashboard/employee/trips", icon: Plane },
    { label: "Travel Requests", href: "/dashboard/employee/requests", icon: FileText },
    { label: "Itineraries", href: "/dashboard/employee/itineraries", icon: FileText },
  ],
  traveler: [
    { label: "Dashboard", href: "/dashboard/traveler", icon: LayoutDashboard },
    { label: "My Trips", href: "/dashboard/traveler/trips", icon: Plane },
    { label: "New Request", href: "/dashboard/traveler/request", icon: FileText },
    { label: "Profile", href: "/dashboard/traveler/profile", icon: Users },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const roleMatch = pathname.match(/\/dashboard\/([^/]+)/)
  const role = (roleMatch?.[1] || "traveler") as keyof typeof dashboardNavs
  const navs = dashboardNavs[role] || dashboardNavs.traveler

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">W</span>
          </div>
          <span className="font-bold text-sidebar-foreground">We-Of-You</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-auto">
        {navs.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10",
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-transparent"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" })
            window.location.href = "/"
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
