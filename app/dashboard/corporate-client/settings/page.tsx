"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Building, Mail } from "lucide-react"

export default function CorporateClientSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Company account and travel policy settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Profile
          </CardTitle>
          <CardDescription>Update your organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" placeholder="Your company name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="billing-email">Billing / Admin Email</Label>
            <Input id="billing-email" type="email" placeholder="admin@company.com" />
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Travel Policy
          </CardTitle>
          <CardDescription>Approval limits and preferred options</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure approval workflows, spending limits, and preferred suppliers. Contact your account manager to update policy settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
