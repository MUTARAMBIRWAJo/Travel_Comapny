"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Handshake, Plus, Edit, Trash2 } from "lucide-react"

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: "", partner_type: "airline", commission_percent: 0 })

  const fetchPartners = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/partners", { credentials: "include" })
      const data = await res.json()
      if (res.ok) setPartners(data.partners || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const createPartner = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm({ name: "", partner_type: "airline", commission_percent: 0 })
        setFormOpen(false)
        fetchPartners()
      } else {
        const d = await res.json()
        alert(d.error || "Failed")
      }
    } catch (err) {
      alert("Failed")
    }
  }

  const deletePartner = async (id: string) => {
    if (!confirm("Delete this partner?")) return
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE", credentials: "include" })
      if (res.ok) fetchPartners()
    } catch {
      alert("Failed")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Partners & Vendors</h2>
        <p className="text-muted-foreground">Airlines, hotels, visa and insurance partners. Track SLAs and commissions.</p>
      </div>

      <div>
        <Button onClick={() => setFormOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={createPartner} className="p-4 bg-muted rounded-lg space-y-2">
          <h3 className="font-semibold">New partner</h3>
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select
              className="border p-2 rounded"
              value={form.partner_type}
              onChange={(e) => setForm({ ...form, partner_type: e.target.value })}
            >
              <option value="airline">Airline</option>
              <option value="hotel">Hotel</option>
              <option value="visa">Visa</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
            <Input
              type="number"
              placeholder="Commission %"
              value={form.commission_percent}
              onChange={(e) => setForm({ ...form, commission_percent: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Create</Button>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5" />
            Partners ({partners.length})
          </CardTitle>
          <CardDescription>CRUD for partners. SLA and metrics can be added per partner.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : partners.length === 0 ? (
            <p className="text-sm text-muted-foreground">No partners yet. Add one above.</p>
          ) : (
            <div className="space-y-2">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{p.partner_type}</Badge>
                      {p.commission_percent != null && (
                        <span className="text-xs text-muted-foreground">{p.commission_percent}% commission</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => deletePartner(p.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
