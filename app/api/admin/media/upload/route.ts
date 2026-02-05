import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../../lib/admin-auth'

export async function POST(request: Request) {
      const authErr = await requireAdmin()
      if (authErr) return authErr

      const formData = await request.formData()
      const file = formData.get('file') as File
      if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

      const supabase = createClient(url, key)

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, file)

      if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

      // Get public URL
      const { data: publicUrl } = supabase.storage
            .from('media')
            .getPublicUrl(fileName)

      // Save to media table
      const { data, error } = await supabase.from('cms_media').insert({
            filename: file.name,
            url: publicUrl.publicUrl,
            mime_type: file.type,
            size: file.size,
            metadata: { original_name: file.name }
      }).select().maybeSingle()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      return NextResponse.json({ media: data })
}