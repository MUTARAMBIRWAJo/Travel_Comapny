import { NextResponse } from 'next/server'
import { requireAdmin } from '../../../../lib/admin-auth'

export async function GET() {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      return NextResponse.json({ authenticated: true })
}