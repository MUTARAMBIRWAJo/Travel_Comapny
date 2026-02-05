import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../../../../lib/admin-auth'
import { logAuditEvent } from '../../../../../lib/audit'

export async function DELETE(request: any, context: any) {
      const authErr = await requireAdmin()
      if (authErr) return authErr
      const params = context?.params instanceof Promise ? await context.params : context?.params
      const id = params?.id

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

      const supabase = createClient(url, key)

      // Get media info first
      const { data: media } = await supabase.from('cms_media').select('*').eq('id', id).maybeSingle()
      if (!media) return NextResponse.json({ error: 'Media not found' }, { status: 404 })

      // Delete from storage (optional, as it might be referenced elsewhere)
      // For now, just delete from DB

      const { error } = await supabase.from('cms_media').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAuditEvent({ entityType: 'media' as any, entityId: id, action: 'status_changed', metadata: { deleted: true, filename: media.filename } as any })

      return NextResponse.json({ success: true })
}