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

      const SECTION_TYPES = [
            { value: 'text', label: 'Text' },
            { value: 'hero', label: 'Hero' },
            { value: 'features', label: 'Features' },
            { value: 'cta', label: 'CTA' },
      ]

      function addSection() {
            setSections([...sections, { type: 'text', content_json: { text: 'New section' } }])
      }

      function updateSection(idx: number, field: string, value: string | Record<string, unknown> | unknown[]) {
            const copy = [...sections]
            if (field === 'type') {
                  copy[idx].type = value as string
                  copy[idx].content_json = copy[idx].content_json || {}
            } else {
                  copy[idx].content_json = { ...(copy[idx].content_json || {}), [field]: value }
            }
            setSections(copy)
      }

      return (
            <div className="space-y-6">
                  <div>
                        <h2 className="text-2xl font-bold">Page Editor</h2>
                        <p className="text-sm text-muted-foreground">Publish to make this page visible at /{page?.page_key || 'slug'}</p>
                  </div>
                  {loading && <div>Loading...</div>}
                  {page && (
                        <div className="space-y-6">
                              <div className="flex flex-wrap gap-2 items-center">
                                    <Input placeholder="Title" value={page.title} onChange={(e) => setPage({ ...page, title: (e.target as HTMLInputElement).value })} className="max-w-xs" />
                                    <Input placeholder="Slug (URL)" value={page.page_key} onChange={(e) => setPage({ ...page, page_key: (e.target as HTMLInputElement).value })} className="max-w-xs" />
                                    <Input placeholder="SEO title" value={page.seo_title || ''} onChange={(e) => setPage({ ...page, seo_title: (e.target as HTMLInputElement).value })} className="max-w-xs" />
                                    <Input placeholder="SEO description" value={page.seo_description || ''} onChange={(e) => setPage({ ...page, seo_description: (e.target as HTMLInputElement).value })} className="max-w-[200px]" />
                                    <select value={page.status} onChange={(e) => setPage({ ...page, status: (e.target as HTMLSelectElement).value })} className="border p-2 rounded">
                                          <option value="draft">Draft</option>
                                          <option value="published">Published</option>
                                    </select>
                              </div>

                              <div>
                                    <h3 className="font-semibold mb-2">Sections</h3>
                                    <div className="space-y-4">
                                          {sections.map((s, idx) => (
                                                <div key={idx} className="border rounded-lg p-4 space-y-2">
                                                      <div className="flex gap-2 flex-wrap">
                                                            <select value={s.type} onChange={(e) => updateSection(idx, 'type', (e.target as HTMLSelectElement).value)} className="border p-2 rounded">
                                                                  {SECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                            </select>
                                                            <Button type="button" variant="outline" size="sm" onClick={() => { const copy = sections.filter((_, i) => i !== idx); setSections(copy) }}>Remove</Button>
                                                      </div>
                                                      {s.type === 'text' && (
                                                            <Input placeholder="Body text" value={s.content_json?.text || ''} onChange={(e) => updateSection(idx, 'text', (e.target as HTMLInputElement).value)} />
                                                      )}
                                                      {s.type === 'hero' && (
                                                            <>
                                                                  <Input placeholder="Hero title" value={s.content_json?.title || ''} onChange={(e) => updateSection(idx, 'title', (e.target as HTMLInputElement).value)} />
                                                                  <Input placeholder="Subtitle" value={s.content_json?.subtitle || ''} onChange={(e) => updateSection(idx, 'subtitle', (e.target as HTMLInputElement).value)} />
                                                            </>
                                                      )}
                                                      {s.type === 'cta' && (
                                                            <>
                                                                  <Input placeholder="Button text" value={s.content_json?.text || ''} onChange={(e) => updateSection(idx, 'text', (e.target as HTMLInputElement).value)} />
                                                                  <Input placeholder="Link (href)" value={s.content_json?.href || ''} onChange={(e) => updateSection(idx, 'href', (e.target as HTMLInputElement).value)} />
                                                            </>
                                                      )}
                                                      {s.type === 'features' && (
                                                            <Input placeholder="Items (JSON array: [{title, description}])" value={typeof s.content_json?.items === 'string' ? s.content_json.items : JSON.stringify(s.content_json?.items || [])} onChange={(e) => { try { updateSection(idx, 'items', JSON.parse((e.target as HTMLInputElement).value || '[]')); } catch { updateSection(idx, 'items', []); } }} className="font-mono text-sm" />
                                                      )}
                                                </div>
                                          ))}
                                    </div>
                                    <Button type="button" variant="outline" className="mt-2" onClick={addSection}>+ Add Section</Button>
                              </div>

                              <div className="flex gap-2">
                                    <Button onClick={save}>Save</Button>
                                    {page.status === 'published' && (
                                          <a href={`/${page.page_key}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent px-4 py-2">View page</a>
                                    )}
                              </div>
                        </div>
                  )}
            </div>
      )
}
