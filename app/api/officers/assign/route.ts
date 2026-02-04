import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// POST assign officer to service request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceRequestId, officerId, assignedBy, notes } = body

    if (!serviceRequestId || !officerId) {
      return NextResponse.json(
        { error: 'Service Request ID and Officer ID are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    // First check if assignment already exists
    const { data: existing } = await supabase
      .from('officer_assignments')
      .select('*')
      .eq('service_request_id', serviceRequestId)
      .eq('status', 'active')
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Service request already has an active officer assignment' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('officer_assignments')
      .insert([
        {
          service_request_id: serviceRequestId,
          officer_id: officerId,
          assigned_by: assignedBy,
          status: 'active',
          notes
        }
      ])
      .select(`
        *,
        officer:users!officer_assignments_officer_id_fkey(id, full_name, email)
      `)

    if (error) {
      console.error('[v0] Error assigning officer:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ assignment: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in POST officer assignment:', error)
    return NextResponse.json(
      { error: 'Failed to assign officer' },
      { status: 500 }
    )
  }
}

// GET assignments for a service request
export async function GET(request: NextRequest) {
  try {
    const serviceRequestId = request.nextUrl.searchParams.get('serviceRequestId')

    if (!serviceRequestId) {
      return NextResponse.json(
        { error: 'Service Request ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    const { data, error } = await supabase
      .from('officer_assignments')
      .select(`
        *,
        officer:users!officer_assignments_officer_id_fkey(id, full_name, email, phone),
        assignedBy:users!officer_assignments_assigned_by_fkey(id, full_name)
      `)
      .eq('service_request_id', serviceRequestId)
      .order('assigned_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching assignments:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ assignments: data })
  } catch (error) {
    console.error('[v0] Error in GET officer assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

// PATCH update assignment status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { assignmentId, status } = body

    if (!assignmentId || !status) {
      return NextResponse.json(
        { error: 'Assignment ID and status are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    const { data, error } = await supabase
      .from('officer_assignments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', assignmentId)
      .select()

    if (error) {
      console.error('[v0] Error updating assignment:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ assignment: data?.[0] })
  } catch (error) {
    console.error('[v0] Error in PATCH officer assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}
