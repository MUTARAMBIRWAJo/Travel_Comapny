"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit } from "lucide-react"

export default function AdminRolesPage() {
      const [roles, setRoles] = React.useState<any[]>([])
      const [loading, setLoading] = React.useState(false)
      const [formOpen, setFormOpen] = React.useState(false)
      const [form, setForm] = React.useState({ name: '', description: '' })
      const [editingRole, setEditingRole] = React.useState<any | null>(null)
      const [editForm, setEditForm] = React.useState({ description: '', permissions: [] as string[] })
      const [error, setError] = React.useState<string | null>(null)

      React.useEffect(() => {
            fetchRoles()
      }, [])

      async function fetchRoles() {
            setLoading(true)
            try {
                  const res = await fetch('/api/admin/roles', { credentials: 'include' })
                  const json = await res.json()
                  if (res.ok) setRoles(json.roles || [])
                  else setError(json.error || 'Failed to load')
            } catch (err: any) {
                  setError(err.message)
            } finally {
                  setLoading(false)
            }
      }

      async function createRole(e: React.FormEvent) {
            e.preventDefault()
            setError(null)
            try {
                  const res = await fetch('/api/admin/roles', {
                        method: 'POST',
                        body: JSON.stringify(form),
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                  })
                  const json = await res.json()
                  if (!res.ok) setError(json.error || 'Failed to create')
                  else {
                        setForm({ name: '', description: '' })
                        setFormOpen(false)
                        fetchRoles()
                  }
            } catch (err: any) {
                  setError(err.message)
            }
      }

      async function updateRole(e: React.FormEvent) {
            e.preventDefault()
            if (!editingRole) return
            setError(null)
            try {
                  const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(editForm),
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                  })
                  const json = await res.json()
                  if (!res.ok) setError(json.error || 'Failed to update')
                  else {
                        setEditingRole(null)
                        fetchRoles()
                  }
            } catch (err: any) {
                  setError(err.message)
            }
      }

      async function deleteRole(id: string) {
            if (!confirm('Are you sure you want to delete this role?')) return
            try {
                  const res = await fetch(`/api/admin/roles/${id}`, { method: 'DELETE', credentials: 'include' })
                  if (res.ok) fetchRoles()
                  else setError('Failed to delete')
            } catch (err: any) {
                  setError(err.message)
            }
      }

      function startEdit(role: any) {
            setEditingRole(role)
            setEditForm({ description: role.description || '', permissions: role.permissions || [] })
      }

      return (
            <div className="space-y-6">
                  <div>
                        <h2 className="text-3xl font-bold text-foreground">Role Management</h2>
                        <p className="text-muted-foreground">Manage system roles and permissions</p>
                  </div>

                  {error && <div className="text-destructive">{error}</div>}

                  <div className="flex gap-2">
                        <Button onClick={() => setFormOpen(true)} className="btn-primary">Add Role</Button>
                  </div>

                  {/* Create role form */}
                  {formOpen && (
                        <form onSubmit={createRole} className="p-4 bg-muted rounded">
                              <div className="flex gap-2 mb-2">
                                    <Input placeholder="Role name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                              </div>
                              <div className="flex gap-2">
                                    <Button type="submit">Create</Button>
                                    <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                              </div>
                        </form>
                  )}

                  {/* Edit role form */}
                  {editingRole && (
                        <form onSubmit={updateRole} className="p-4 bg-muted rounded">
                              <h3 className="font-semibold mb-2">Edit Role: {editingRole.name}</h3>
                              <div className="mb-2">
                                    <Input placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                              </div>
                              <div className="mb-2">
                                    <label>Permissions (comma-separated):</label>
                                    <Input value={editForm.permissions.join(', ')} onChange={(e) => setEditForm({ ...editForm, permissions: e.target.value.split(',').map(p => p.trim()) })} />
                              </div>
                              <div className="flex gap-2">
                                    <Button type="submit">Update</Button>
                                    <Button variant="outline" onClick={() => setEditingRole(null)}>Cancel</Button>
                              </div>
                        </form>
                  )}

                  {/* Roles Table */}
                  <Card>
                        <CardHeader>
                              <CardTitle>All Roles</CardTitle>
                              <CardDescription>Total: {roles.length} roles</CardDescription>
                        </CardHeader>
                        <CardContent>
                              <div className="space-y-3">
                                    {loading ? (
                                          <div>Loading...</div>
                                    ) : (
                                          roles.map((role) => (
                                                <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                      <div className="flex-1">
                                                            <p className="font-semibold">{role.name}</p>
                                                            <p className="text-sm text-muted-foreground">{role.description}</p>
                                                            {role.permissions && role.permissions.length > 0 && (
                                                                  <div className="flex gap-1 mt-1">
                                                                        {role.permissions.map((p: string, i: number) => <Badge key={i} variant="outline">{p}</Badge>)}
                                                                  </div>
                                                            )}
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                            <span className="text-sm text-muted-foreground">{new Date(role.created_at).toLocaleDateString()}</span>
                                                            <Button variant="outline" size="sm" onClick={() => startEdit(role)}>
                                                                  <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" onClick={() => deleteRole(role.id)}>
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