import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = [
  "/dashboard/admin",
  "/dashboard/agent",
  "/dashboard/corporate-client",
  "/dashboard/employee",
  "/dashboard/traveler",
]

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("session_token")?.value
  const pathname = request.nextUrl.pathname

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|public).*)"],
}
