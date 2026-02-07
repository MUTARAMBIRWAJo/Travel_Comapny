import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
      try {
            const supabase = await createClient()

            const { data: services, error } = await supabase
                  .from('services')
                  .select('*')
                  .eq('status', 'active')
                  .order('display_order', { ascending: true })

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ services: services || [] })
      } catch (error) {
            console.error('Failed to fetch services:', error)
            return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
      }
}
