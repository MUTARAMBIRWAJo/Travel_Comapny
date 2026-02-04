import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// GET all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        traveler:users!conversations_traveler_id_fkey(id, full_name, email),
        admin:users!conversations_admin_id_fkey(id, full_name, email),
        officer:users!conversations_officer_id_fkey(id, full_name, email)
      `)
      .or(`traveler_id.eq.${userId},admin_id.eq.${userId},officer_id.eq.${userId}`)
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (error) {
      console.error('[v0] Error fetching conversations:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ conversations: data })
  } catch (error) {
    console.error('[v0] Error in GET conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { travelerId, adminId, officerId, serviceRequestId, title } = body

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          traveler_id: travelerId,
          admin_id: adminId,
          officer_id: officerId,
          service_request_id: serviceRequestId,
          title: title || `Service Request #${serviceRequestId?.slice(0, 8)}`,
          status: 'open'
        }
      ])
      .select()

    if (error) {
      console.error('[v0] Error creating conversation:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ conversation: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in POST conversations:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
