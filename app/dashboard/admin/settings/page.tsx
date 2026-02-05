"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Save } from "lucide-react"

export default function AdminSiteSettingsPage() {
      const [settings, setSettings] = React.useState<any[]>([])
      const [loading, setLoading] = React.useState(false)
      const [editing, setEditing] = React.useState<string | null>(null)
      const [editValue, setEditValue] = React.useState('')
      const [error, setError] = React.useState<string | null>(null)

      React.useEffect(() => {
            fetchSettings()
      }, [])

      async function fetchSettings() {
            setLoading(true)
            try {
                  const res = await fetch('/api/admin/site-settings', { credentials: 'include' })
                  const json = await res.json()
                  if (res.ok) setSettings(json.settings || [])
                  else setError(json.error || 'Failed to load')
            } catch (err: any) {
                  setError(err.message)
            } finally {
                  setLoading(false)
            }
      }

      async function updateSetting(key: string, value: string) {
            try {
                  const setting = settings.find(s => s.key === key)
                  const res = await fetch('/api/admin/site-settings', {
                        method: 'POST',
                        body: JSON.stringify({ key, value, type: setting?.type || 'string', description: setting?.description }),
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                  })
                  const json = await res.json()
                  if (!res.ok) setError(json.error || 'Failed to update')
                  else {
                        setEditing(null)
                        fetchSettings()
                  }
            } catch (err: any) {
                  setError(err.message)
            }
      }

      function startEdit(setting: any) {
            setEditing(setting.key)
            setEditValue(setting.value || '')
      }

      function renderValue(setting: any) {
            if (setting.type === 'boolean') {
                  return setting.value === 'true' ? 'Yes' : 'No'
            }
            if (setting.type === 'number') {
                  return Number(setting.value).toLocaleString()
            }
            return setting.value
      }

      return (
            <div className="space-y-6">
                  <div>
                        <h2 className="text-3xl font-bold text-foreground">Site Settings</h2>
                        <p className="text-muted-foreground">Manage global site configuration</p>
                  </div>

                  {error && <div className="text-destructive">{error}</div>}

                  {/* Settings List */}
                  <Card>
                        <CardHeader>
                              <CardTitle>All Settings</CardTitle>
                              <CardDescription>Global site configuration</CardDescription>
                        </CardHeader>
                        <CardContent>
                              <div className="space-y-3">
                                    {loading ? (
                                          <div>Loading...</div>
                                    ) : (
                                          settings.map((setting) => (
                                                <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                                                      <div className="flex-1">
                                                            <p className="font-semibold">{setting.key}</p>
                                                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                                                            <Badge variant="outline">{setting.type}</Badge>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                            {editing === setting.key ? (
                                                                  <div className="flex gap-2">
                                                                        {setting.type === 'boolean' ? (
                                                                              <select value={editValue} onChange={(e) => setEditValue(e.target.value)} className="border p-1">
                                                                                    <option value="true">Yes</option>
                                                                                    <option value="false">No</option>
                                                                              </select>
                                                                        ) : (
                                                                              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-48" />
                                                                        )}
                                                                        <Button size="sm" onClick={() => updateSetting(setting.key, editValue)}>
                                                                              <Save className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button variant="outline" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
                                                                  </div>
                                                            ) : (
                                                                  <>
                                                                        <span className="font-mono">{renderValue(setting)}</span>
                                                                        <Button variant="outline" size="sm" onClick={() => startEdit(setting)}>
                                                                              <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                  </>
                                                            )}
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