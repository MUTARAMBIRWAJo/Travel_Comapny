/**
 * Phase 7 — Public API key verification. Tenant-aware; rate limiting via key config.
 */

import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/** Hash a raw API key for storage comparison. */
export function hashApiKey(secret: string): string {
  return crypto.createHash("sha256").update(secret).digest("hex")
}

/** Prefix for display/identification (first 8 chars of key). */
export function keyPrefix(secret: string): string {
  return secret.slice(0, 8)
}

/**
 * Resolve API key from header (Authorization: Bearer <key> or X-API-Key: <key>).
 * Returns { companyId, scopes } or null if invalid.
 */
export async function resolveApiKey(
  authHeader: string | null,
  xApiKey: string | null
): Promise<{ company_id: string; scopes: string[] } | null> {
  const raw = xApiKey || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null)
  if (!raw || raw.length < 16) return null

  const supabase = getSupabase()
  if (!supabase) return null

  const prefix = raw.slice(0, 8)
  const hash = hashApiKey(raw)

  const { data: rows, error } = await supabase
    .from("api_keys")
    .select("id, company_id, scopes, key_hash, expires_at, rate_limit_per_minute")
    .eq("key_prefix", prefix)

  if (error || !rows?.length) return null
  const row = rows.find((r: { key_hash: string; expires_at: string | null }) => r.key_hash === hash && (!r.expires_at || new Date(r.expires_at) > new Date()))
  if (!row) return null

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", row.id)

  return {
    company_id: row.company_id,
    scopes: Array.isArray(row.scopes) ? row.scopes : [],
  }
}

export function requireScope(resolved: { scopes: string[] }, scope: string): boolean {
  return resolved.scopes.includes("*") || resolved.scopes.includes(scope)
}
