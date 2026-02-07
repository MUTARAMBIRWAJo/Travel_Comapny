/**
 * Simple in-memory cache for API responses (public pages, packages, site settings).
 * For production at scale, use Redis or CDN cache. TTL in seconds.
 */

const cache = new Map<string, { value: unknown; expiresAt: number }>()
const DEFAULT_TTL_SECONDS = 60

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.value as T
}

export function setCached(key: string, value: unknown, ttlSeconds: number = DEFAULT_TTL_SECONDS): void {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}

export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return [prefix, ...parts].join(":")
}
