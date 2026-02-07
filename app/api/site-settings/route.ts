import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Public API: get global site settings (key-value).
 * Used by public pages to read dynamic config. No auth required.
 * Cache-friendly for published content.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ settings: {} })
  }

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value, type")
    .order("key", { ascending: true })

  if (error) {
    return NextResponse.json({ settings: {} })
  }

  const settings: Record<string, string | number | boolean> = {}
  for (const row of data || []) {
    let v: string | number | boolean = row.value ?? ""
    if (row.type === "number") v = Number(row.value) || 0
    if (row.type === "boolean") v = String(row.value).toLowerCase() === "true"
    settings[row.key] = v
  }

  const res = NextResponse.json({ settings })
  res.headers.set("Cache-Control", "public, max-age=60, s-maxage=300")
  return res
}
