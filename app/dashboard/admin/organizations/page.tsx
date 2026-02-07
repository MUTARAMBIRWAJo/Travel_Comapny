"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit } from "lucide-react"

export default function AdminOrganizationsPage() {
      const [organizations, setOrganizations] = React.useState<any[]>([])
      const [users, setUsers] = React.useState<any[]>([])
      const [loading, setLoading] = React.useState(false)
      const [formOpen, setFormOpen] = React.useState(false)
      const [form, setForm] = React.useState({ name: '', billing_email: '' })
      const [editingOrg, setEditingOrg] = React.useState<any | null>(null)
      const [editForm, setEditForm] = React.useState({ name: '', billing_email: '', settings: {} as Record<string, unknown>, admin_user_id: '' })
      const [error, setError] = React.useState<string | null>(null)

      React.useEffect(() => {
            fetchOrganizations()
      }, [])

      React.useEffect(() => {
            fetch('/api/admin/users', { credentials: 'include' })
                  .then((r) => r.json())
                  .then((d) => setUsers(d.users || []))
                  .catch(() => {})
      }, [])

      async function fetchOrganizations() {
            setLoading(true)
            try {
                  const res = await fetch('/api/admin/organizations')
                  const json = await res.json()
                  if (res.ok) setOrganizations(json.organizations || [])
                  else setError(json.error || 'Failed to load')
            } catch (err: any) {
                  setError(err.message)
            } finally {
                  setLoading(false)
            }
      }

      async function createOrganization(e: React.FormEvent) {
            e.preventDefault()
            setError(null)
            try {
                  const res = await fetch('/api/admin/organizations', { method: 'POST', body: JSON.stringify(form), headers: { 'Content-Type': 'application/json' } })
                  const json = await res.json()
                  if (!res.ok) setError(json.error || 'Failed to create')
                  else {
                        setForm({ name: '', billing_email: '' })
                        setFormOpen(false)
                        fetchOrganizations()
                  }
            } catch (err: any) {
                  setError(err.message)
            }
      }

      async function updateOrganization(e: React.FormEvent) {
            e.preventDefault()
            if (!editingOrg) return
            setError(null)
            try {
                  const res = await fetch(`/api/admin/organizations/${editingOrg.id}`, { method: 'PUT', body: JSON.stringify(editForm), headers: { 'Content-Type': 'application/json' } })
                  const json = await res.json()
                  if (!res.ok) setError(json.error || 'Failed to update')
                  else {
                        setEditingOrg(null)
                        fetchOrganizations()
                  }
            } catch (err: any) {
                  setError(err.message)
            }
      }

      async function deleteOrganization(id: string) {
            if (!confirm('Are you sure you want to delete this organization?')) return
            try {
                  const res = await fetch(`/api/admin/organizations/${id}`, { method: 'DELETE' })
                  if (res.ok) fetchOrganizations()
                  else setError('Failed to delete')
            } catch (err: any) {
                  setError(err.message)
            }
      }

      function startEdit(org: any) {
            setEditingOrg(org)
            setEditForm({
              name: org.name || '',
              billing_email: org.billing_email || '',
              settings: org.settings || {},
              admin_user_id: org.admin_user_id ?? '',
            })
      }

      return (
            <div className="space-y-6">
                  <div>
                        <h2 className="text-3xl font-bold text-foreground">Organization Management</h2>
                        <p className="text-muted-foreground">Manage organizations and their settings</p>
                  </div>

                  {error && <div className="text-destructive">{error}</div>}

                  <div className="flex gap-2">
                        <Button onClick={() => setFormOpen(true)} className="btn-primary">Add Organization</Button>
                  </div>

                  {/* Create organization form */}
                  {formOpen && (
                        <form onSubmit={createOrganization} className="p-4 bg-muted rounded">
                              <div className="flex gap-2 mb-2">
                                    <Input placeholder="Organization name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    <Input placeholder="Billing email" value={form.billing_email} onChange={(e) => setForm({ ...form, billing_email: e.target.value })} />
                              </div>
                              <div className="flex gap-2">
                                    <Button type="submit">Create</Button>
                                    <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                              </div>
                        </form>
                  )}

                  {/* Edit organization form */}
                  {editingOrg && (
                        <form onSubmit={updateOrganization} className="p-4 bg-muted rounded">
                              <h3 className="font-semibold mb-2">Edit Organization: {editingOrg.name}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                    <Input placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                    <Input placeholder="Billing email" value={editForm.billing_email} onChange={(e) => setEditForm({ ...editForm, billing_email: e.target.value })} />
                                    <select className="border p-2 rounded" value={editForm.admin_user_id} onChange={(e) => setEditForm({ ...editForm, admin_user_id: e.target.value })}>
                                          <option value="">No admin</option>
                                          {users.map((u) => (
                                            <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                                          ))}
                                    </select>
                              </div>
                              <div className="flex gap-2">
                                    <Button type="submit">Update</Button>
                                    <Button variant="outline" onClick={() => setEditingOrg(null)}>Cancel</Button>
                              </div>
                        </form>
                  )}

                  {/* Organizations Table */}
                  <Card>
                        <CardHeader>
                              <CardTitle>All Organizations</CardTitle>
                              <CardDescription>Total: {organizations.length} organizations</CardDescription>
                        </CardHeader>
                        <CardContent>
                              <div className="space-y-3">
                                    {loading ? (
                                          <div>Loading...</div>
                                    ) : (
                                          organizations.map((org) => (
                                                <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                      <div className="flex-1">
                                                            <p className="font-semibold">{org.name}</p>
                                                            <p className="text-sm text-muted-foreground">{org.billing_email}</p>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                            <span className="text-sm text-muted-foreground">{new Date(org.created_at).toLocaleDateString()}</span>
                                                            <Button variant="outline" size="sm" onClick={() => startEdit(org)}>
                                                                  <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" onClick={() => deleteOrganization(org.id)}>
                                                                  <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                      </div>
                                                </div>
                                          ))
                                    )}
                              </div>
                        </CardContent>
                  </Card>
            </div>
      )
}