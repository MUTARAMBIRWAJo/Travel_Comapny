import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// Simple slug generator
function generateSlug(text: string): string {
      return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
}

// GET - List all tenants (super admin only)
export async function GET(request: NextRequest) {
      try {
            const supabase = await createClient()

            // Check if user is super admin
            const { data: currentUser } = await supabase
                  .from('users')
                  .select('role')
                  .eq('id', (await supabase.auth.getUser()).data.user?.id)
                  .single()

            if (currentUser?.role !== 'super_admin') {
                  // Regular users can only see their own tenant
                  const { data: user } = await supabase
                        .from('users')
                        .select('tenant_id')
                        .eq('id', (await supabase.auth.getUser()).data.user?.id)
                        .single()

                  if (!user?.tenant_id) {
                        return NextResponse.json({ error: 'Not associated with any tenant' }, { status: 403 })
                  }

                  const { data: tenant } = await supabase
                        .from('tenants')
                        .select('*')
                        .eq('id', user.tenant_id)
                        .single()

                  return NextResponse.json({ tenants: [tenant] })
            }

            // Super admin can see all tenants
            const { searchParams } = new URL(request.url)
            const status = searchParams.get('status')
            const plan = searchParams.get('plan')
            const page = parseInt(searchParams.get('page') || '1')
            const limit = parseInt(searchParams.get('limit') || '20')

            let query = supabase
                  .from('tenants')
                  .select('*, tenant_subscriptions(plan_id, subscription_plans(name, code))', { count: 'exact' })

            if (status) query = query.eq('status', status)
            if (plan) query = query.eq('plan', plan)

            const { data: tenants, error, count } = await query
                  .range((page - 1) * limit, page * limit - 1)
                  .order('created_at', { ascending: false })

            if (error) {
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({
                  tenants: tenants || [],
                  pagination: {
                        page,
                        limit,
                        total: count,
                        totalPages: Math.ceil((count || 0) / limit)
                  }
            })
      } catch (error) {
            console.error('Error fetching tenants:', error)
            return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 })
      }
}

// POST - Create new tenant (onboarding)
export async function POST(request: NextRequest) {
      try {
            const supabase = await createClient()
            const body = await request.json()

            const {
                  name,
                  slug,
                  domain,
                  tenant_type = 'company',
                  industry,
                  size,
                  plan = 'trial',
                  billing_email,
                  branding = {},
                  config = {},
                  admin_user = {} // { email, full_name, password }
            } = body

            // Validate required fields
            if (!name) {
                  return NextResponse.json({ error: 'Tenant name is required' }, { status: 400 })
            }

            // Generate slug if not provided
            const tenantSlug = slug || generateSlug(name)

            // Check if slug or domain already exists
            const { data: existing } = await supabase
                  .from('tenants')
                  .select('id')
                  .or(`slug.eq.${tenantSlug}${domain ? `,domain.eq.${domain}` : ''}`)
                  .single()

            if (existing) {
                  return NextResponse.json({ error: 'Tenant with this slug or domain already exists' }, { status: 409 })
            }

            // Create tenant
            const { data: tenant, error: tenantError } = await supabase
                  .from('tenants')
                  .insert({
                        name,
                        slug: tenantSlug,
                        domain,
                        tenant_type,
                        industry,
                        size,
                        plan,
                        billing_email,
                        branding,
                        config,
                        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days trial
                  })
                  .select()
                  .single()

            if (tenantError) {
                  return NextResponse.json({ error: tenantError.message }, { status: 500 })
            }

            // Create default subscription
            const { data: planData } = await supabase
                  .from('subscription_plans')
                  .select('id')
                  .eq('code', plan)
                  .single()

            if (planData) {
                  await supabase.from('tenant_subscriptions').insert({
                        tenant_id: tenant.id,
                        plan_id: planData.id,
                        status: 'trialing',
                        current_period_start: new Date().toISOString(),
                        current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                        trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
                  })
            }

            // Create default travel policy
            await supabase.from('tenant_travel_policies').insert({
                  tenant_id: tenant.id,
                  name: 'Default Policy',
                  description: 'Default travel policy',
                  rules: {
                        max_advance_booking_days: 90,
                        advance_purchase_days: 7,
                        max_duration_days: 30,
                        require_approval_amount: 1000,
                        economy_required: true
                  },
                  is_default: true
            })

            // Create admin user if provided
            if (admin_user.email && admin_user.password) {
                  // Create auth user
                  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                        email: admin_user.email,
                        password: admin_user.password,
                        email_confirm: true
                  })

                  if (authUser?.user) {
                        // Create user record linked to tenant
                        await supabase.from('users').insert({
                              id: authUser.user.id,
                              email: admin_user.email,
                              full_name: admin_user.full_name || name + ' Admin',
                              role: 'admin',
                              tenant_id: tenant.id,
                              status: 'active'
                        })

                        // Create default department for tenant
                        const { data: dept } = await supabase.from('departments').insert({
                              tenant_id: tenant.id,
                              name: 'Administration',
                              code: 'ADMIN'
                        }).select().single()

                        if (dept) {
                              await supabase.from('user_departments').insert({
                                    user_id: authUser.user.id,
                                    department_id: dept.id,
                                    is_primary: true
                              })
                        }
                  }
            }

            return NextResponse.json({ tenant }, { status: 201 })
      } catch (error) {
            console.error('Error creating tenant:', error)
            return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
      }
}

// PUT - Update tenant
export async function PUT(request: NextRequest) {
      try {
            const supabase = await createClient()
            const body = await request.json()
            const { id, ...updates } = body

            if (!id) {
                  return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
            }

            // Validate tenant access
            const { data: currentUser } = await supabase
                  .from('users')
                  .select('tenant_id, role')
                  .eq('id', (await supabase.auth.getUser()).data.user?.id)
                  .single()

            if (!currentUser || currentUser.tenant_id !== id) {
                  return NextResponse.json({ error: 'Access denied' }, { status: 403 })
            }

            // Only admins can update tenant
            if (!['admin', 'super_admin'].includes(currentUser.role)) {
                  return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
            }

            // Prevent updating protected fields
            delete updates.id
            delete updates.created_at
            delete updates.plan // Plan changes through subscription endpoint

            updates.updated_at = new Date().toISOString()

            const { data: tenant, error } = await supabase
                  .from('tenants')
                  .update(updates)
                  .eq('id', id)
                  .select()
                  .single()

            if (error) {
                  return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ tenant })
      } catch (error) {
            console.error('Error updating tenant:', error)
            return NextResponse.json({ error: 'Failed to update tenant' }, { status: 500 })
      }
}

// DELETE - Delete or archive tenant (super admin only)
export async function DELETE(request: NextRequest) {
      try {
            const supabase = await createClient()
            const { searchParams } = new URL(request.url)
            const id = searchParams.get('id')
            const archive = searchParams.get('archive') === 'true'

            if (!id) {
                  return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
            }

            // Check super admin
            const { data: currentUser } = await supabase
                  .from('users')
                  .select('role')
                  .eq('id', (await supabase.auth.getUser()).data.user?.id)
                  .single()

            if (currentUser?.role !== 'super_admin') {
                  return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
            }

            if (archive) {
                  // Soft delete - archive tenant
                  const { error } = await supabase
                        .from('tenants')
                        .update({ status: 'archived', updated_at: new Date().toISOString() })
                        .eq('id', id)

                  if (error) {
                        return NextResponse.json({ error: error.message }, { status: 500 })
                  }
            } else {
                  // Hard delete - use with caution!
                  const { error } = await supabase
                        .from('tenants')
                        .delete()
                        .eq('id', id)

                  if (error) {
                        return NextResponse.json({ error: error.message }, { status: 500 })
                  }
            }

            return NextResponse.json({ success: true })
      } catch (error) {
            console.error('Error deleting tenant:', error)
            return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 500 })
      }
}
