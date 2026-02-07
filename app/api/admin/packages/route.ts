import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
      try {
            const supabase = await createClient()

            const { data: packages, error } = await supabase
                  .from('packages')
                  .select('*')
                  .order('created_at', { ascending: false })

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ packages: packages || [] })
      } catch (error) {
            console.error('Failed to fetch packages:', error)
            return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
      }
}

export async function POST(request: NextRequest) {
      try {
            const supabase = await createClient()
            const body = await request.json()

            const { data, error } = await supabase
                  .from('packages')
                  .insert(body)
                  .select()
                  .single()

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ package: data }, { status: 201 })
      } catch (error) {
            console.error('Failed to create package:', error)
            return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
      }
}

export async function PUT(request: NextRequest) {
      try {
            const supabase = await createClient()
            const body = await request.json()
            const { id, ...updates } = body

            const { data, error } = await supabase
                  .from('packages')
                  .update({ ...updates, updated_at: new Date().toISOString() })
                  .eq('id', id)
                  .select()
                  .single()

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            if (!data) {
                  return NextResponse.json({ error: 'Package not found' }, { status: 404 })
            }

            return NextResponse.json({ package: data })
      } catch (error) {
            console.error('Failed to update package:', error)
            return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
      }
}

export async function DELETE(request: NextRequest) {
      try {
            const supabase = await createClient()
            const { searchParams } = new URL(request.url)
            const id = searchParams.get('id')

            if (!id) {
                  return NextResponse.json({ error: 'Package ID required' }, { status: 400 })
            }

            const { error } = await supabase
                  .from('packages')
                  .delete()
                  .eq('id', id)

            if (error) {
                  console.error('Supabase error:', error)
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ success: true })
      } catch (error) {
            console.error('Failed to delete package:', error)
            return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
      }
}
