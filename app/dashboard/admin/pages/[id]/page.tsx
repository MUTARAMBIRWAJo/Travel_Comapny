"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PageEditor({ params }: any) {
      const { id } = params
      const [page, setPage] = useState<any>(null)
      const [sections, setSections] = useState<any[]>([])
      const [loading, setLoading] = useState(false)

      const fetchPage = useCallback(async () => {
            setLoading(true)
            const res = await fetch(`/api/admin/pages/${id}`)
            const json = await res.json()
            if (res.ok) {
                  setPage(json.page)
                  setSections(json.sections || [])
            } else alert(json.error)
            setLoading(false)
      }, [id])

      useEffect(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchPage()
      }, [fetchPage])

      async function save() {
            const res = await fetch(`/api/admin/pages/${id}`, { method: 'PUT', body: JSON.stringify({ title: page.title, slug: page.page_key, status: page.status, seo_title: page.seo_title, seo_description: page.seo_description, sections }), headers: { 'Content-Type': 'application/json' } })
            const json = await res.json()
            if (res.ok) alert('Saved')
            else alert(json.error || 'Failed')
      }

      function addSection() {
            setSections([...sections, { type: 'text', content_json: { text: 'New section' } }])
      }

      return (
            <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Page Editor</h2>
                  {loading && <div>Loading...</div>}
                  {page && (
                        <div>
                              <div className="flex gap-2">
                                    <Input value={page.title} onChange={(e) => setPage({ ...page, title: (e.target as HTMLInputElement).value })} />
                                    <Input value={page.page_key} onChange={(e) => setPage({ ...page, page_key: (e.target as HTMLInputElement).value })} />
                                    <select value={page.status} onChange={(e) => setPage({ ...page, status: (e.target as HTMLSelectElement).value })} className="border p-2">
                                          <option value="draft">Draft</option>
                                          <option value="published">Published</option>
                                    </select>
                              </div>

                              <div className="mt-4">
                                    <h3 className="font-semibold">Sections</h3>
                                    <div className="space-y-2">
                                          {sections.map((s, idx) => (
                                                <div key={idx} className="border p-2">
                                                      <div className="flex gap-2">
                                                            <Input value={s.type} onChange={(e) => { const copy = [...sections]; copy[idx].type = (e.target as HTMLInputElement).value; setSections(copy) }} />
                                                            <Input value={s.content_json?.text || ''} onChange={(e) => { const copy = [...sections]; copy[idx].content_json = { text: (e.target as HTMLInputElement).value }; setSections(copy) }} />
                                                            <Button onClick={() => { const copy = sections.filter((_, i) => i !== idx); setSections(copy) }}>Delete</Button>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                                    <div className="mt-2">
                                          <Button onClick={addSection}>Add Section</Button>
                                    </div>
                              </div>

                              <div className="mt-4">
                                    <Button onClick={save}>Save</Button>
                              </div>
                        </div>
                  )}
            </div>
      )
}
