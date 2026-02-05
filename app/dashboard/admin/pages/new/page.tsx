"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function NewPage() {
      const [title, setTitle] = useState('')
      const [slug, setSlug] = useState('')
      const router = useRouter()
      async function create() {
            const res = await fetch('/api/admin/pages', { method: 'POST', body: JSON.stringify({ title, slug, status: 'draft' }), headers: { 'Content-Type': 'application/json' } })
            const json = await res.json()
            if (res.ok) router.push(`/dashboard/admin/pages/${json.page.id}`)
            else alert(json.error || 'Failed')
      }
      return (
            <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Create Page</h2>
                  <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Input placeholder="Slug (e.g., about)" value={slug} onChange={(e) => setSlug(e.target.value)} />
                  <div>
                        <Button onClick={create}>Create</Button>
                  </div>
            </div>
      )
}
