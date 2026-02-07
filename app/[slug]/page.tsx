import { createClient } from '@supabase/supabase-js'
import React from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const revalidate = 60

interface Section { type: string; content_json: any }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
      const slug = params.slug
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return { title: 'Page not found' }
      const supabase = createClient(url, key)
      const { data: version, error: versionError } = await supabase
        .from('cms_page_versions')
        .select('*')
        .eq('page_key', slug)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (versionError) return { title: 'Page not found' }
      if (!version) return { title: 'Page not found' }
      return {
            title: version.seo_title || version.title_en || version.title,
            description: version.seo_description,
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
      // Get latest published version
      const { data: version, error: versionError } = await supabase
        .from('cms_page_versions')
        .select('*')
        .eq('page_key', slug)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (versionError) return <div>Page not found</div>
      if (!version) return <div>Page not found</div>

      // Fetch base page record to obtain sections
      const { data: pageBase } = await supabase.from('cms_pages').select('*').eq('page_key', slug).maybeSingle()
      const { data: rawSections } = pageBase
        ? await supabase.from('cms_page_sections').select('*').eq('page_id', pageBase.id).order('order_index', { ascending: true })
        : { data: [] }
      const sections: Section[] = (rawSections || []).map((s: any) => ({
        type: s.type || s.section_type || 'text',
        content_json: s.content_json || (s.content_en != null ? { text: s.content_en } : {}),
      }))

      const page = {
        page_key: version.page_key,
        title: version.title_en || (pageBase && ((pageBase as any).title || (pageBase as any).title_en)) || '',
        content_en: version.content_en,
        seo_title: version.seo_title,
        seo_description: version.seo_description,
        published_at: version.published_at,
        last_updated: version.published_at || version.created_at
      }

      return (
            <>
                  <Navbar />
                  <main className="min-h-screen">
                        <div className="prose mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                              <h1>{page.title}</h1>
                              {page.last_updated && (
                                    <p className="text-sm text-muted-foreground">Last updated: {new Date(page.last_updated).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                              )}
                              {sections.map((s, i) => (
                                    <SectionRenderer key={i} section={s} />
                              ))}
                        </div>
                  </main>
                  <Footer />
            </>
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
