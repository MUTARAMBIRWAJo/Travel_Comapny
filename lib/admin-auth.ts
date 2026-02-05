import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function getCurrentUserFromCookie() {
      const cookieStore = await cookies()
      const token = cookieStore.get('session_token')?.value
      if (!token) return null

      // token format previously used: base64(userId:...)
      try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8')
            const userId = decoded.split(':')[0]
            if (!userId) return null

            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY
            if (!url || !key) return null

            const supabase = createClient(url, key)
            const { data: user, error } = await supabase.from('users').select('id,email,full_name,role,status,company_id').eq('id', userId).maybeSingle()
            if (error) return null
            return user
      } catch (err) {
            return null
      }
}

export async function requireAdmin() {
      const user = await getCurrentUserFromCookie()
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const role = (user.role || '').toString().toLowerCase()
      if (role !== 'admin' && role !== 'administrator') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return null
}
