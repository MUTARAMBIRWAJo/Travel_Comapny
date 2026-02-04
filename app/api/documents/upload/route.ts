import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const serviceRequestId = formData.get('serviceRequestId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = crypto.randomBytes(8).toString('hex')
    const filename = `${timestamp}-${randomStr}-${file.name}`
    const filepath = `service-requests/${serviceRequestId}/${filename}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('service-documents')
      .upload(filepath, buffer, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      console.log('[v0] Storage error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data } = supabase.storage
      .from('service-documents')
      .getPublicUrl(filepath)

    return NextResponse.json({
      success: true,
      filePath: filepath,
      publicUrl: data?.publicUrl,
      filename: file.name,
      size: file.size
    }, { status: 201 })
  } catch (error) {
    console.log('[v0] Error in POST /api/documents/upload:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
