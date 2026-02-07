import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
      try {
            const supabase = await createClient()

            const { data: services, error } = await supabase
                  .from('services')
                  .select('*')
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

export async function POST(request: NextRequest) {
      try {
            const supabase = await createClient()
            const body = await request.json()

            const { data, error } = await supabase
                  .from('services')
                  .insert(body)
                  .select()
                  .single()

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ service: data }, { status: 201 })
      } catch (error) {
            console.error('Failed to create service:', error)
            return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
      }
}

export async function PUT(request: NextRequest) {
      try {
            const supabase = await createClient()
            const body = await request.json()
            const { id, ...updates } = body

            const { data, error } = await supabase
                  .from('services')
                  .update({ ...updates, updated_at: new Date().toISOString() })
                  .eq('id', id)
                  .select()
                  .single()

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            if (!data) {
                  return NextResponse.json({ error: 'Service not found' }, { status: 404 })
            }

            return NextResponse.json({ service: data })
      } catch (error) {
            console.error('Failed to update service:', error)
            return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
      }
}

export async function DELETE(request: NextRequest) {
      try {
            const supabase = await createClient()
            const { searchParams } = new URL(request.url)
            const id = searchParams.get('id')

            if (!id) {
                  return NextResponse.json({ error: 'Service ID required' }, { status: 400 })
            }

            const { error } = await supabase
                  .from('services')
                  .delete()
                  .eq('id', id)

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ success: true })
      } catch (error) {
            console.error('Failed to delete service:', error)
            return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
      }
}
