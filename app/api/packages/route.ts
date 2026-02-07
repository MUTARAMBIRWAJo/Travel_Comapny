import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')

    let query = supabase
      .from('packages')
      .select('*')
      .eq('status', 'active')

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data: packages, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data for public API
    const publicPackages = (packages || []).map(pkg => ({
      id: pkg.id,
      title: pkg.title_en,
      title_rw: pkg.title_rw,
      title_fr: pkg.title_fr,
      duration: pkg.duration,
      price_usd: pkg.price_usd,
      price_rwf: pkg.price_rwf,
      includes_en: pkg.includes_en,
      image: pkg.image_url,
      status: pkg.status,
      featured: pkg.featured,
      category: pkg.category || 'Travel Package',
      destination: pkg.destination || 'Various',
      description: pkg.short_description_en || pkg.includes_en,
    }))

    return NextResponse.json({ packages: publicPackages })
  } catch (error) {
    console.error('Failed to fetch packages:', error)
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}
