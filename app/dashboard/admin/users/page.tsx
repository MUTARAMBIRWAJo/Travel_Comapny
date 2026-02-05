"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Edit } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [formOpen, setFormOpen] = React.useState(false)
  const [form, setForm] = React.useState({ email: '', full_name: '', role: 'TRAVEL_AGENT' })
  const [editingUser, setEditingUser] = React.useState<any | null>(null)
  const [editForm, setEditForm] = React.useState({ full_name: '', role: '', status: '', company_id: '' })
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' })
      const json = await res.json()
      if (res.ok) setUsers(json.users || [])
      else setError(json.error || 'Failed to load')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Failed to create')
      else {
        setForm({ email: '', full_name: '', role: 'TRAVEL_AGENT' })
        setFormOpen(false)
        fetchUsers()
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchUsers()
      else setError('Failed to delete')
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function editUser(e: React.FormEvent) {
    e.preventDefault()
    if (!editingUser) return
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Failed to update')
      else {
        setEditingUser(null)
        fetchUsers()
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  function startEdit(user: any) {
    setEditingUser(user)
    setEditForm({ full_name: user.full_name || '', role: user.role || '', status: user.status || '', company_id: user.company_id || '' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground">Manage system users and permissions</p>
      </div>

      {error && <div className="text-destructive">{error}</div>}

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>
        <Button onClick={() => setFormOpen(true)} className="btn-primary">Add User</Button>
      </div>

      {/* Create user form (simple) */}
      {formOpen && (
        <form onSubmit={createUser} className="p-4 bg-muted rounded">
          <div className="flex gap-2 mb-2">
            <Input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select className="border p-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="ADMIN">ADMIN</option>
              <option value="TRAVEL_AGENT">TRAVEL_AGENT</option>
              <option value="CORPORATE_CLIENT">CORPORATE_CLIENT</option>
              <option value="CORPORATE_EMPLOYEE">CORPORATE_EMPLOYEE</option>
              <option value="INDIVIDUAL_TRAVELER">INDIVIDUAL_TRAVELER</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Create</Button>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Edit user form */}
      {editingUser && (
        <form onSubmit={editUser} className="p-4 bg-muted rounded">
          <h3 className="font-semibold mb-2">Edit User: {editingUser.email}</h3>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Full name" value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
            <select className="border p-2" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
              <option value="ADMIN">ADMIN</option>
              <option value="TRAVEL_AGENT">TRAVEL_AGENT</option>
              <option value="CORPORATE_CLIENT">CORPORATE_CLIENT</option>
              <option value="CORPORATE_EMPLOYEE">CORPORATE_EMPLOYEE</option>
              <option value="INDIVIDUAL_TRAVELER">INDIVIDUAL_TRAVELER</option>
            </select>
            <select className="border p-2" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Update</Button>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total: {users.length} users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div>Loading...</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{user.full_name || user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{(user.role || '').replace(/_/g, ' ')}</Badge>
                    <Badge variant="outline">{user.status}</Badge>
                    <span className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
                    <Button variant="outline" size="sm" onClick={() => startEdit(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteUser(user.id)}>
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
