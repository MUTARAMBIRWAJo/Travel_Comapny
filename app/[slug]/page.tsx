import { createClient } from '@supabase/supabase-js'
import React from 'react'
import { Metadata } from 'next'

interface Section { type: string; content_json: any }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
      const slug = params.slug
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return { title: 'Page not found' }
      const supabase = createClient(url, key)
      const { data: page } = await supabase.from('cms_pages').select('*').eq('page_key', slug).eq('status', 'published').maybeSingle()
      if (!page) return { title: 'Page not found' }
      return {
            title: page.seo_title || page.title,
            description: page.seo_description,
      }
}

export default async function Page({ params }: { params: { slug: string } }) {
      const slug = params.slug
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) {
            return <div>Supabase not configured</div>
      }
      const supabase = createClient(url, key)
      const { data: page } = await supabase.from('cms_pages').select('*').eq('page_key', slug).eq('status', 'published').maybeSingle()
      if (!page) return <div>Page not found</div>
      const { data: sections } = await supabase.from('cms_page_sections').select('*').eq('page_id', page.id).order('order_index', { ascending: true })

      return (
            <main className="prose mx-auto p-6">
                  <h1>{page.title}</h1>
                  {sections?.map((s: Section, i: number) => (
                        <SectionRenderer key={i} section={s} />
                  ))}
            </main>
      )
}

function SectionRenderer({ section }: { section: Section }) {
      const type = (section.type || '').toLowerCase()
      const data = section.content_json || {}
      if (type === 'hero') {
            return (
                  <section className="py-8">
                        <h2 className="text-3xl font-bold">{data.title}</h2>
                        <p>{data.subtitle}</p>
                  </section>
            )
      }
      if (type === 'text') {
            return (
                  <section className="py-4">
                        <p>{data.text}</p>
                  </section>
            )
      }
      if (type === 'features' && Array.isArray(data.items)) {
            return (
                  <section className="py-4">
                        <ul>
                              {data.items.map((it: any, idx: number) => (
                                    <li key={idx}>{it.title} - {it.description}</li>
                              ))}
                        </ul>
                  </section>
            )
      }
      if (type === 'cta') {
            return (
                  <section className="py-4">
                        <a className="btn" href={data.href}>{data.text}</a>
                  </section>
            )
      }
      return null
}
