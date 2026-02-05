import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Simple in-memory rate limiter and response cache-control enforcer.
 * - Limits requests per IP for public APIs and pages.
 * - Adds Cache-Control for public page JSON responses when appropriate.
 *
 * Notes:
 * - In-memory limiter is suitable for single-instance dev/staging.
 * - For production, replace with a distributed store (Redis) and a robust rate-limiter.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 60 // 60 requests per window per IP

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function isRateLimited(ip: string) {
      const now = Date.now()
      const bucket = buckets.get(ip)
      if (!bucket) {
            buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
            return false
      }
      if (now > bucket.resetAt) {
            bucket.count = 1
            bucket.resetAt = now + RATE_LIMIT_WINDOW_MS
            buckets.set(ip, bucket)
            return false
      }
      bucket.count += 1
      buckets.set(ip, bucket)
      return bucket.count > RATE_LIMIT_MAX
}

/**
 * Extract client IP from request headers.
 * - Prefers `x-forwarded-for` (first entry) then `x-real-ip`.
 * - Return 'unknown' when no header is present.
 *
 * Important: Ensure your proxy/CDN forwards these headers and that
 * you validate/trust them appropriately in production.
 */
function getClientIp(req: NextRequest) {
      const xff = req.headers.get('x-forwarded-for') || ''
      const ips = xff.split(',').map(s => s.trim()).filter(Boolean)
      if (ips.length > 0) return ips[0]
      const xr = req.headers.get('x-real-ip')
      if (xr) return xr
      return 'unknown'
}

export function middleware(req: NextRequest) {
      const ip = getClientIp(req)
      const url = req.nextUrl.clone()
      const pathname = url.pathname

      // Apply rate limiting to public API endpoints and public pages
      if (pathname.startsWith('/api/') || pathname.startsWith('/privacy') || pathname.startsWith('/terms') || pathname.startsWith('/cookies') || pathname.startsWith('/')) {
            if (isRateLimited(ip)) {
                  const res = NextResponse.json({ error: 'Too many requests' }, { status: 429 })
                  res.headers.set('Retry-After', String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)))
                  return res
            }
      }

      // Continue normally. We will rely on route handlers to set Cache-Control for responses.
      return NextResponse.next()
}

// Apply to all routes (adjust matcher if you want to narrow scope)
export const config = {
      matcher: [
            /*
              Rate-limit and protect:
              - All API routes
              - Public pages (root + slug pages)
            */
            '/api/:path*',
            '/',
            '/:slug*'
      ]
}
