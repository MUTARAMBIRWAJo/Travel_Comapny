import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('currency_rates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.log('[v0] Error fetching rates:', error)
      return NextResponse.json(
        { 
          rates: {
            USD: 1,
            RWF: 1300,
            EUR: 0.95,
            GBP: 0.85,
            KES: 135,
            UGX: 4200,
            ZAR: 18.5,
            TZS: 2650
          },
          lastUpdated: new Date().toISOString()
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      rates: data?.rates || {},
      lastUpdated: data?.updated_at
    }, { status: 200 })
  } catch (error) {
    console.log('[v0] Error in GET /api/currency/rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rates } = body

    if (!rates || typeof rates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid rates object' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('currency_rates')
      .insert({
        rates,
        updated_at: new Date().toISOString(),
        updated_by: 'admin' // In production, get from session
      })

    if (error) {
      console.log('[v0] Error saving rates:', error)
      return NextResponse.json(
        { error: 'Failed to save rates' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, rates },
      { status: 200 }
    )
  } catch (error) {
    console.log('[v0] Error in POST /api/currency/rates:', error)
    return NextResponse.json(
      { error: 'Failed to save rates' },
      { status: 500 }
    )
  }
}
