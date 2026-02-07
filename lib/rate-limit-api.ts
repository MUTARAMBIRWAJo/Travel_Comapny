import { NextResponse } from "next/server"
import { checkRateLimit, type RateLimitOptions, AUTH_RATE_LIMIT, DEFAULT_PUBLIC_LIMIT } from "./rate-limit"

export { AUTH_RATE_LIMIT, DEFAULT_PUBLIC_LIMIT }

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown"
  return ip
}

/**
 * Call at the start of a route. Returns NextResponse (429) if over limit; otherwise null.
 * Use options from rate-limit.ts (e.g. AUTH_RATE_LIMIT, DEFAULT_PUBLIC_LIMIT).
 */
export function rateLimitResponse(
  request: Request,
  options: Omit<RateLimitOptions, "key">
): NextResponse | null {
  const key = getClientIdentifier(request)
  const result = checkRateLimit({ ...options, key })
  if (result.allowed) return null
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Limit": String(options.limit),
        "X-RateLimit-Remaining": "0",
      },
    }
  )
}
