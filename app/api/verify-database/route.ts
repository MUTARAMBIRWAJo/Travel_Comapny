import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const [
      { count: rolesCount },
      { count: usersCount },
      { count: companiesCount },
      { count: destinationsCount },
      { count: packagesCount },
      { count: requestsCount },
      { count: tripsCount },
      { count: postsCount },
    ] = await Promise.all([
      supabase.from("roles").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("destinations").select("*", { count: "exact", head: true }),
      supabase.from("travel_packages").select("*", { count: "exact", head: true }),
      supabase.from("travel_requests").select("*", { count: "exact", head: true }),
      supabase.from("trips").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    ])

    const totalRecords =
      (rolesCount || 0) +
      (usersCount || 0) +
      (companiesCount || 0) +
      (destinationsCount || 0) +
      (packagesCount || 0) +
      (requestsCount || 0) +
      (tripsCount || 0) +
      (postsCount || 0)

    return NextResponse.json({
      status: "Database Verification",
      timestamp: new Date().toISOString(),
      data: {
        roles: rolesCount,
        users: usersCount,
        companies: companiesCount,
        destinations: destinationsCount,
        packages: packagesCount,
        travelRequests: requestsCount,
        trips: tripsCount,
        blogPosts: postsCount,
        totalRecords,
      },
      testCredentials: {
        admin: { email: "admin@weofyou.com", password: "Admin@123" },
        agent: { email: "sarah.agent@weofyou.com", password: "Agent@123" },
        corporate: { email: "company.admin1@tech.com", password: "Corporate@123" },
        employee: { email: "employee1@tech.com", password: "Employee@123" },
        traveler: { email: "john.traveler@email.com", password: "Traveler@123" },
      },
    })
  } catch (error) {
    console.error("[v0] Database verification error:", error)
    return NextResponse.json(
      {
        error: "Failed to verify database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
