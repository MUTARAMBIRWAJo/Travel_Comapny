import { createClient } from "@supabase/supabase-js"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  LEGAL_DEFAULTS,
  LEGAL_PAGE_SLUGS,
  type LegalSlug,
} from "@/lib/legal-defaults"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!LEGAL_PAGE_SLUGS.includes(slug as LegalSlug)) {
    return { title: "Page not found" }
  }
  const cms = await getCmsLegalPage(slug)
  const def = LEGAL_DEFAULTS[slug as LegalSlug]
  const title = cms?.seoTitle || cms?.title || def.seoTitle
  const description = (cms?.seoDescription || def.seoDescription).slice(0, 160)
  return { title, description }
}

async function getCmsLegalPage(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key)
  const { data: version } = await supabase
    .from("cms_page_versions")
    .select("title_en, content_en, seo_title, seo_description, published_at, created_at")
    .eq("page_key", slug)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!version) return null

  const { data: pageBase } = await supabase
    .from("cms_pages")
    .select("id")
    .eq("page_key", slug)
    .maybeSingle()

  let sections: { type: string; content_json: Record<string, unknown> }[] = []
  if (pageBase?.id) {
    const { data: raw } = await supabase
      .from("cms_page_sections")
      .select("type, section_type, content_json, content_en")
      .eq("page_id", pageBase.id)
      .order("order_index", { ascending: true })
    sections = (raw || []).map((s) => ({
      type: s.type || s.section_type || "text",
      content_json: s.content_json || (s.content_en != null ? { text: s.content_en } : {}),
    }))
  }

  return {
    title: version.title_en,
    content: version.content_en,
    seoTitle: version.seo_title,
    seoDescription: version.seo_description,
    lastUpdated: version.published_at || version.created_at,
    sections,
  }
}

function renderContent(content: string) {
  return content.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null
    if (/^\*\*[^*]+\*\*/.test(trimmed)) {
      return (
        <h2 key={i} className="text-lg font-semibold mt-6 mb-2">
          {trimmed.replace(/\*\*/g, "")}
        </h2>
      )
    }
    return (
      <p key={i} className="mb-4 text-muted-foreground">
        {trimmed}
      </p>
    )
  })
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!LEGAL_PAGE_SLUGS.includes(slug as LegalSlug)) notFound()

  const cms = await getCmsLegalPage(slug)
  const def = LEGAL_DEFAULTS[slug as LegalSlug]

  const title = cms?.title || def.title
  const seoTitle = cms?.seoTitle || def.seoTitle
  const content = cms?.content ?? def.content
  const lastUpdated = cms?.lastUpdated
  const sections = cms?.sections

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="section-header mb-4">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mb-8">
              Last updated:{" "}
              {new Date(lastUpdated).toLocaleDateString("en-GB", {
                dateStyle: "long",
              })}
            </p>
          )}
          {sections && sections.length > 0 ? (
            <div className="space-y-6 text-muted-foreground">
              {sections.map((s, i) => (
                <section key={i}>
                  {s.type === "text" && (
                    <p>{(s.content_json as { text?: string }).text}</p>
                  )}
                  {s.type === "hero" && (
                    <>
                      <h2 className="text-xl font-semibold text-foreground">
                        {(s.content_json as { title?: string }).title}
                      </h2>
                      <p>{(s.content_json as { subtitle?: string }).subtitle}</p>
                    </>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {renderContent(content)}
            </div>
          )}
          <p className="mt-10 text-sm text-muted-foreground">
            For more information, see our{" "}
            <Link href="/legal/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/legal/terms-and-conditions" className="text-primary hover:underline">
              Terms & Conditions
            </Link>
            , or{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            . This content does not constitute legal advice; we recommend independent legal review where appropriate.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return LEGAL_PAGE_SLUGS.map((slug) => ({ slug }))
}
