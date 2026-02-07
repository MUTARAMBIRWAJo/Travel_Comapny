import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// GET - Get subscription for current tenant
export async function GET(request: NextRequest) {
      try {
            const supabase = await createClient()

            // Get current user's tenant
            const { data: user } = await supabase
                  .from('users')
                  .select('tenant_id, role')
                  .eq('id', (await supabase.auth.getUser()).data.user?.id)
                  .single()

            if (!user?.tenant_id) {
                  return NextResponse.json({ error: 'No tenant associated' }, { status: 403 })
            }

            // Get subscription with plan details
            const { data: subscription } = await supabase
                  .from('tenant_subscriptions')
                  .select(`
        *,
        subscription_plans (
          id, name, code, description, price_usd, billing_interval,
          max_users, max_trips_per_month, ai_calls_per_month, api_rate_limit, features
        )
      `)
                  .eq('tenant_id', user.tenant_id)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single()

            if (!subscription) {
                  return NextResponse.json({
                        subscription: null,
                        plan: null,
                        message: 'No active subscription'
                  })
            }

            // Get usage for current period
            const now = new Date()
            const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
            const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

            const { data: usage } = await supabase
                  .from('tenant_usage')
                  .select('*')
                  .eq('tenant_id', user.tenant_id)
                  .gte('period_start', periodStart.toISOString())
                  .lte('period_end', periodEnd.toISOString())
                  .single()

            // Get current usage stats - count is returned separately
            const usersResult = await supabase
                  .from('users')
                  .select('id', { count: 'exact' })
                  .eq('tenant_id', user.tenant_id)
                  .eq('status', 'active')

            const tripsResult = await supabase
                  .from('trips')
                  .select('id', { count: 'exact' })
                  .eq('tenant_id', user.tenant_id)
                  .gte('created_at', periodStart.toISOString())

            return NextResponse.json({
                  subscription,
                  usage: usage || {
                        users_count: usersResult.count || 0,
                        trips_count: tripsResult.count || 0,
                        ai_calls_count: 0,
                        api_calls_count: 0
                  },
                  limits: {
                        users: subscription.subscription_plans?.max_users || 5,
                        trips: subscription.subscription_plans?.max_trips_per_month || 50,
                        ai_calls: subscription.subscription_plans?.ai_calls_per_month || 100
                  }
            })
      } catch (error) {
            console.error('Error fetching subscription:', error)
            return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
      }
}

// POST - Change subscription plan
export async function POST(request: NextRequest) {
      try {
            const supabase = await createClient()
            const body = await request.json()
            const { plan_code } = body

            if (!plan_code) {
                  return NextResponse.json({ error: 'Plan code is required' }, { status: 400 })
            }

            // Get current user's tenant
            const { data: user } = await supabase
                  .from('users')
                  .select('tenant_id, role')
                  .eq('id', (await supabase.auth.getUser()).data.user?.id)
                  .single()

            if (!user?.tenant_id || !['admin', 'super_admin'].includes(user.role)) {
                  return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
            }

            // Get the new plan
            const { data: newPlan } = await supabase
                  .from('subscription_plans')
                  .select('*')
                  .eq('code', plan_code)
                  .eq('is_active', true)
                  .single()

            if (!newPlan) {
                  return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
            }

            // Get or create subscription
            const { data: existingSub } = await supabase
                  .from('tenant_subscriptions')
                  .select('*')
                  .eq('tenant_id', user.tenant_id)
                  .in('status', ['active', 'trialing'])
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single()

            const now = new Date()
            const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
            const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

            if (existingSub) {
                  // Update existing subscription
                  const { error } = await supabase
                        .from('tenant_subscriptions')
                        .update({
                              plan_id: newPlan.id,
                              current_period_start: periodStart.toISOString(),
                              current_period_end: periodEnd.toISOString()
                        })
                        .eq('id', existingSub.id)

                  if (error) {
                        return NextResponse.json({ error: error.message }, { status: 500 })
                  }
            } else {
                  // Create new subscription
                  const { error } = await supabase
                        .from('tenant_subscriptions')
                        .insert({
                              tenant_id: user.tenant_id,
                              plan_id: newPlan.id,
                              status: 'active',
                              current_period_start: periodStart.toISOString(),
                              current_period_end: periodEnd.toISOString()
                        })

                  if (error) {
                        return NextResponse.json({ error: error.message }, { status: 500 })
                  }
            }

            // Update tenant plan
            await supabase
                  .from('tenants')
                  .update({
                        plan: plan_code,
                        max_users: newPlan.max_users,
                        max_trips_per_month: newPlan.max_trips_per_month,
                        updated_at: new Date().toISOString()
                  })
                  .eq('id', user.tenant_id)

            return NextResponse.json({
                  success: true,
                  message: `Subscription changed to ${newPlan.name}`
            })
      } catch (error) {
            console.error('Error changing subscription:', error)
            return NextResponse.json({ error: 'Failed to change subscription' }, { status: 500 })
      }
}

// PUT - Cancel subscription
export async function PUT(request: NextRequest) {
      try {
            const supabase = await createClient()
            const { cancelImmediately } = await request.json()

            // Get current user's tenant
            const { data: user } = await supabase
                  .from('users')
                  .select('tenant_id, role')
                  .eq('id', (await supabase.auth.getUser()).data.user?.id)
                  .single()

            if (!user?.tenant_id || !['admin', 'super_admin'].includes(user.role)) {
                  return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
            }

            // Get active subscription
            const { data: subscription } = await supabase
                  .from('tenant_subscriptions')
                  .select('*')
                  .eq('tenant_id', user.tenant_id)
                  .in('status', ['active', 'trialing'])
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single()

            if (!subscription) {
                  return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
            }

            if (cancelImmediately) {
                  // Immediate cancellation
                  await supabase
                        .from('tenant_subscriptions')
                        .update({
                              status: 'cancelled',
                              cancelled_at: new Date().toISOString()
                        })
                        .eq('id', subscription.id)

                  await supabase
                        .from('tenants')
                        .update({ status: 'suspended' })
                        .eq('id', user.tenant_id)
            } else {
                  // Cancel at period end
                  await supabase
                        .from('tenant_subscriptions')
                        .update({
                              cancel_at_period_end: true
                        })
                        .eq('id', subscription.id)
            }

            return NextResponse.json({
                  success: true,
                  message: cancelImmediately
                        ? 'Subscription cancelled immediately'
                        : 'Subscription will be cancelled at end of billing period'
            })
      } catch (error) {
            console.error('Error cancelling subscription:', error)
            return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
      }
}
