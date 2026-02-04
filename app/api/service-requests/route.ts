import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status')
    
    let query = supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.log('[v0] Error fetching requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch requests', requests: [] },
        { status: 500 }
      )
    }

    return NextResponse.json({
      requests: data || [],
      total: data?.length || 0
    }, { status: 200 })
  } catch (error) {
    console.log('[v0] Error in GET /api/service-requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests', requests: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      service_type,
      traveller_name,
      traveller_email,
      traveller_phone,
      traveller_country,
      destination,
      travel_date,
      budget_usd,
      description,
      documents
    } = body

    // Validate required fields
    if (!traveller_name || !traveller_email || !destination || !travel_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert service request
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        service_type,
        traveller_name,
        traveller_email,
        traveller_phone,
        traveller_country,
        destination,
        travel_date,
        budget_usd: budget_usd || 0,
        description,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.log('[v0] Error creating request:', error)
      return NextResponse.json(
        { error: 'Failed to create request' },
        { status: 500 }
      )
    }

    // Link documents if provided
    if (documents && documents.length > 0 && data) {
      const documentRecords = documents.map((docPath: string) => ({
        service_request_id: data.id,
        document_path: docPath,
        document_type: 'supporting',
        uploaded_by: 'traveller',
        created_at: new Date().toISOString()
      }))

      await supabase
        .from('service_documents')
        .insert(documentRecords)
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: 'Service request created successfully'
    }, { status: 201 })
  } catch (error) {
    console.log('[v0] Error in POST /api/service-requests:', error)
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    )
  }
}
