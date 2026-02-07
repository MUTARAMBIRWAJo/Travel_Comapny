import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromCookie } from "@/lib/admin-auth"
import { logAccessEvent, getRequestMeta } from "@/lib/access-log"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromCookie()
    const { ipAddress, userAgent } = getRequestMeta(request)

    const cookieStore = await cookies()
    cookieStore.delete("session_token")

    if (user) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (url && key) {
        const supabase = createClient(url, key)
        await supabase.from("sessions").delete().eq("user_id", (user as { id: string }).id)
      }
      await logAccessEvent({
        eventType: "logout",
        userId: (user as { id?: string }).id,
        email: (user as { email?: string }).email,
        ipAddress,
        userAgent,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
