import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// GET all officers
export async function GET(request: NextRequest) {
  try {
    const specialization = request.nextUrl.searchParams.get('specialization')

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    let query = supabase
      .from('users')
      .select(`
        id,
        full_name,
        email,
        phone,
        avatar_url,
        role,
        created_at,
        specializations:officer_specializations(*)
      `)
      .eq('role', 'officer')

    if (specialization) {
      query = query.filter('specializations.specialization', 'eq', specialization)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Error fetching officers:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ officers: data })
  } catch (error) {
    console.error('[v0] Error in GET officers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch officers' },
      { status: 500 }
    )
  }
}

// POST add officer specialization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { officerId, specialization, experienceLevel } = body

    if (!officerId || !specialization) {
      return NextResponse.json(
        { error: 'Officer ID and specialization are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    const { data, error } = await supabase
      .from('officer_specializations')
      .insert([
        {
          officer_id: officerId,
          specialization,
          experience_level: experienceLevel || 'intermediate'
        }
      ])
      .select()

    if (error) {
      console.error('[v0] Error adding specialization:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ specialization: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in POST officers:', error)
    return NextResponse.json(
      { error: 'Failed to add specialization' },
      { status: 500 }
    )
  }
}
