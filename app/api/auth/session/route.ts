import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(url, key)
    let userId: string | null = null

    if (UUID_REGEX.test(sessionToken)) {
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('user_id, expires_at')
        .eq('id', sessionToken)
        .maybeSingle()
      if (sessionError || !session) return NextResponse.json({ user: null }, { status: 200 })
      if (new Date(session.expires_at) < new Date()) return NextResponse.json({ user: null }, { status: 200 })
      userId = session.user_id
    } else {
      const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
      userId = decoded.split(':')[0] || null
    }

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, preferred_language, preferred_currency, company_id')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('[v0] Session lookup error:', error)
      return NextResponse.json({ error: 'Failed to load session' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        language: user.preferred_language,
        currency: user.preferred_currency,
        company_id: user.company_id,
      },
    })
  } catch (error) {
    console.error('[v0] Session error:', error)
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 })
  }
}
