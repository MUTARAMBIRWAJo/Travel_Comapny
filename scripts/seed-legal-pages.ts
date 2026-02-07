/**
 * Seed CMS with the 7 legal pages and default content.
 * Run with: npx tsx scripts/seed-legal-pages.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL (from .env).
 */
import path from "path"
import { config } from "dotenv"

config({ path: path.resolve(process.cwd(), ".env") })
config({ path: path.resolve(process.cwd(), ".local.env") })

import { createClient } from "@supabase/supabase-js"
import { LEGAL_DEFAULTS, LEGAL_PAGE_SLUGS } from "../lib/legal-defaults"

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(url, key)

  for (const slug of LEGAL_PAGE_SLUGS) {
    const def = LEGAL_DEFAULTS[slug]
    const { data: existing } = await supabase
      .from("cms_pages")
      .select("id")
      .eq("page_key", slug)
      .maybeSingle()

    let pageId = existing?.id

    if (!pageId) {
      const { data: inserted, error: pageErr } = await supabase
        .from("cms_pages")
        .insert({
          page_key: slug,
          title: def.title,
          title_en: def.title,
          slug,
          status: "published",
          seo_title: def.seoTitle,
          seo_description: def.seoDescription,
        })
        .select("id")
        .single()
      if (pageErr) {
        console.warn(`[seed-legal] Insert cms_pages ${slug}:`, pageErr)
        continue
      }
      pageId = inserted.id
    }

    const { data: version } = await supabase
      .from("cms_page_versions")
      .select("id")
      .eq("page_key", slug)
      .eq("is_published", true)
      .maybeSingle()

    if (!version) {
      const { error: verErr } = await supabase.from("cms_page_versions").insert({
        page_key: slug,
        title_en: def.title,
        slug,
        content_en: def.content,
        seo_title: def.seoTitle,
        seo_description: def.seoDescription,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      if (verErr) console.warn(`[seed-legal] Insert cms_page_versions ${slug}:`, verErr)
      else console.log(`[seed-legal] Created published version for ${slug}`)
    }
  }

  console.log("[seed-legal] Done.")
}

seed()
