"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AdminPagesList() {
      const [pages, setPages] = useState<any[]>([])
      const [loading, setLoading] = useState(false)
      const router = useRouter()

      const fetchPages = useCallback(async () => {
            setLoading(true)
            const res = await fetch('/api/admin/pages')
            const json = await res.json()
            if (res.ok) setPages(json.pages || [])
            setLoading(false)
      }, [])

      useEffect(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchPages()
      }, [fetchPages])

      return (
            <div className="space-y-6">
                  <div>
                        <h2 className="text-3xl font-bold">Pages</h2>
                        <p className="text-muted-foreground">Manage public pages and content</p>
                  </div>

                  <div className="flex justify-end">
                        <Button onClick={() => router.push('/dashboard/admin/pages/new')}>+ New Page</Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                        {loading && <div>Loading...</div>}
                        {pages.map((p) => (
                              <Card key={p.id} className="hover:shadow-lg">
                                    <CardHeader>
                                          <CardTitle className="text-lg">{p.title}</CardTitle>
                                          <CardDescription>{p.page_key} • {p.status}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                          <div className="flex justify-between">
                                                <div>
                                                      <div className="text-sm text-muted-foreground">{p.seo_title}</div>
                                                </div>
                                                <div className="space-x-2">
                                                      <Button onClick={() => router.push(`/dashboard/admin/pages/${p.id}`)} variant="outline">Edit</Button>
                                                </div>
                                          </div>
                                    </CardContent>
                              </Card>
                        ))}
                  </div>
            </div>
      )
}
