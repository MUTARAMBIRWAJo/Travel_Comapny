/**
 * In-memory rate limiter for API routes.
 * For production at scale, use Redis or similar. Keys are per-identifier (IP or API key).
 */

const store = new Map<string, { count: number; resetAt: number }>()
const CLEAN_INTERVAL_MS = 60_000
let cleanTimer: ReturnType<typeof setInterval> | null = null

function ensureCleaner() {
  if (cleanTimer) return
  cleanTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, v] of store.entries()) {
      if (v.resetAt < now) store.delete(key)
    }
  }, CLEAN_INTERVAL_MS)
}

export interface RateLimitOptions {
  /** Unique key (e.g. IP or user id) */
  key: string
  /** Max requests in the window */
  limit: number
  /** Window in seconds */
  windowSeconds: number
}

export function checkRateLimit(options: RateLimitOptions): { allowed: boolean; remaining: number; resetAt: number } {
  ensureCleaner()
  const { key, limit, windowSeconds } = options
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  let entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    entry = { count: 1, resetAt: now + windowMs }
    store.set(key, entry)
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt }
  }

  entry.count += 1
  const remaining = Math.max(0, limit - entry.count)
  const allowed = entry.count <= limit
  return { allowed, remaining, resetAt: entry.resetAt }
}

/** Default: 100 requests per 60 seconds per key for public APIs */
export const DEFAULT_PUBLIC_LIMIT = { limit: 100, windowSeconds: 60 }

/** Stricter: 10 requests per 60 seconds for auth endpoints */
export const AUTH_RATE_LIMIT = { limit: 10, windowSeconds: 60 }
