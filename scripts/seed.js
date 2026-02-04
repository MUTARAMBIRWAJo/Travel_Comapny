import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[v0] Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

async function seed() {
  console.log("[v0] Starting database seed with Supabase...")

  try {
    // 1. Create Roles
    console.log("[v0] Creating roles...")
    const roles = [
      {
        name: "ADMIN",
        permissions: ["manage_users", "manage_companies", "view_analytics", "manage_content"],
        description: "System administrator with full access",
      },
      {
        name: "TRAVEL_AGENT",
        permissions: ["manage_requests", "view_requests", "approve_requests", "communicate_clients"],
        description: "Travel agent managing client requests",
      },
      {
        name: "CORPORATE_CLIENT",
        permissions: ["manage_employees", "view_analytics", "manage_policy", "view_requests"],
        description: "Corporate account manager",
      },
      {
        name: "CORPORATE_EMPLOYEE",
        permissions: ["view_requests", "create_requests", "view_trips"],
        description: "Corporate employee",
      },
      {
        name: "INDIVIDUAL_TRAVELER",
        permissions: ["view_packages", "create_requests", "manage_profile"],
        description: "Individual traveler",
      },
    ]

    const { data: rolesData, error: rolesError } = await supabase.from("roles").insert(
      roles.map((role) => ({
        name: role.name,
        permissions: role.permissions,
        description: role.description,
      })),
    )

    if (rolesError) throw rolesError
    console.log("[v0] Created 5 roles")

    // 2. Create Companies
    console.log("[v0] Creating companies...")
    const companies = [
      {
        name: "TechCorp International",
        email: "hr@techcorp.com",
        phone: "+1-202-555-0142",
        address: "123 Tech Avenue, San Francisco, CA 94105",
        country: "USA",
        industry: "Technology",
        employees_count: 5000,
      },
      {
        name: "Global Finance Ltd",
        email: "hr@globalfinance.com",
        phone: "+44-20-7946-0958",
        address: "456 Finance Street, London, UK",
        country: "United Kingdom",
        industry: "Financial Services",
        employees_count: 3000,
      },
      {
        name: "Creative Solutions Inc",
        email: "hr@creativesolutions.com",
        phone: "+61-2-9248-8100",
        address: "789 Innovation Way, Sydney, Australia",
        country: "Australia",
        industry: "Creative Services",
        employees_count: 500,
      },
    ]

    const { data: companiesData, error: companiesError } = await supabase.from("companies").insert(companies)

    if (companiesError) throw companiesError
    console.log("[v0] Created 3 companies")

    // 3. Create Destinations
    console.log("[v0] Creating destinations...")
    const destinations = [
      {
        name: "Rwanda",
        country: "Rwanda",
        region: "East Africa",
        description: "Discover the land of a thousand hills with stunning landscapes and wildlife.",
        climate: "Tropical",
        best_season: "Jun-Sep",
        currency: "RWF",
        language: "Kinyarwanda",
        attractions: ["Volcanoes National Park", "Serengeti", "Kigali Genocide Memorial"],
      },
      {
        name: "Paris",
        country: "France",
        region: "Western Europe",
        description: "Experience the City of Light with iconic landmarks and world-class culture.",
        climate: "Temperate",
        best_season: "May-Sep",
        currency: "EUR",
        language: "French",
        attractions: ["Eiffel Tower", "Louvre", "Notre-Dame"],
      },
      {
        name: "Maldives",
        country: "Maldives",
        region: "South Asia",
        description: "Relax in the most exclusive tropical paradise with crystal-clear waters.",
        climate: "Tropical",
        best_season: "Nov-Apr",
        currency: "MVR",
        language: "Dhivehi",
        attractions: ["Coral Reefs", "Water Villas", "Snorkeling"],
      },
      {
        name: "Tanzania",
        country: "Tanzania",
        region: "East Africa",
        description: "Witness the great migration and explore pristine natural beauty.",
        climate: "Subtropical",
        best_season: "Jun-Oct",
        currency: "TZS",
        language: "Swahili",
        attractions: ["Mount Kilimanjaro", "Serengeti", "Zanzibar"],
      },
      {
        name: "Costa Rica",
        country: "Costa Rica",
        region: "Central America",
        description: "Explore biodiversity hotspot with adventure and eco-tourism.",
        climate: "Tropical",
        best_season: "Dec-Apr",
        currency: "CRC",
        language: "Spanish",
        attractions: ["Cloud Forests", "Beaches", "Wildlife"],
      },
      {
        name: "Japan",
        country: "Japan",
        region: "East Asia",
        description: "Experience tradition and modernity in the land of the rising sun.",
        climate: "Temperate",
        best_season: "Mar-May",
        currency: "JPY",
        language: "Japanese",
        attractions: ["Mount Fuji", "Tokyo", "Kyoto Temples"],
      },
    ]

    const { data: destinationsData, error: destinationsError } = await supabase.from("destinations").insert(
      destinations.map((d) => ({
        name: d.name,
        country: d.country,
        region: d.region,
        description: d.description,
        climate: d.climate,
        best_season: d.best_season,
        currency: d.currency,
        language: d.language,
        attractions: d.attractions,
      })),
    )

    if (destinationsError) throw destinationsError
    console.log("[v0] Created 6 destinations")

    // 4. Create Travel Packages
    console.log("[v0] Creating travel packages...")
    const packages = [
      {
        name: "Rwanda Adventure",
        destination: "Rwanda",
        duration_days: 5,
        price_usd: 2500,
        description: "Explore the stunning landscapes and wildlife of Rwanda.",
        included_services: ["Accommodation in luxury hotel", "Guided tours", "Transportation", "Meals"],
        difficulty_level: "Moderate",
        max_group_size: 15,
      },
      {
        name: "Paris Romance",
        destination: "Paris",
        duration_days: 7,
        price_usd: 3500,
        description: "Experience the magic of Paris with cultural tours and dining.",
        included_services: [" 4-star hotel", "City tours", "Museum passes", "Dining credits"],
        difficulty_level: "Easy",
        max_group_size: 20,
      },
      {
        name: "Maldives Paradise",
        destination: "Maldives",
        duration_days: 10,
        price_usd: 5000,
        description: "Luxury resort experience in the Maldives.",
        included_services: ["Water villa", "All-inclusive meals", "Spa", "Water activities"],
        difficulty_level: "Easy",
        max_group_size: 10,
      },
      {
        name: "Tanzania Safari",
        destination: "Tanzania",
        duration_days: 8,
        price_usd: 4000,
        description: "Experience the great migration and wildlife safari.",
        included_services: ["Safari lodge", "Game drives", "Professional guide", "Meals"],
        difficulty_level: "Moderate",
        max_group_size: 12,
      },
      {
        name: "Costa Rica Eco-Tour",
        destination: "Costa Rica",
        duration_days: 6,
        price_usd: 3000,
        description: "Eco-tourism adventure in the cloud forests.",
        included_services: ["Eco-lodge", "Guided hikes", "Wildlife tours", "Meals"],
        difficulty_level: "Moderate",
        max_group_size: 16,
      },
      {
        name: "Japan Discovery",
        destination: "Japan",
        duration_days: 10,
        price_usd: 4500,
        description: "Traditional and modern Japan experience.",
        included_services: ["Hotels", "Train pass", "Guided tours", "Meals"],
        difficulty_level: "Easy",
        max_group_size: 18,
      },
    ]

    const { data: packagesData, error: packagesError } = await supabase.from("travel_packages").insert(
      packages.map((p) => ({
        name: p.name,
        destination: p.destination,
        duration_days: p.duration_days,
        price_usd: p.price_usd,
        description: p.description,
        included_services: p.included_services,
        difficulty_level: p.difficulty_level,
        max_group_size: p.max_group_size,
      })),
    )

    if (packagesError) throw packagesError
    console.log("[v0] Created 6 travel packages")

    // 5. Create Users with HASHED passwords
    console.log("[v0] Creating users with hashed passwords...")
    const users = [
      {
        email: "admin@weofyou.com",
        password: "Admin@123",
        name: "Admin User",
        role: "ADMIN",
      },
      {
        email: "sarah.agent@weofyou.com",
        password: "Agent@123",
        name: "Sarah Johnson",
        role: "TRAVEL_AGENT",
      },
      {
        email: "company.admin1@tech.com",
        password: "Corporate@123",
        name: "Mike Thompson",
        role: "CORPORATE_CLIENT",
        company_id: 1,
      },
      {
        email: "employee1@tech.com",
        password: "Employee@123",
        name: "John Smith",
        role: "CORPORATE_EMPLOYEE",
        company_id: 1,
      },
      {
        email: "john.traveler@email.com",
        password: "Traveler@123",
        name: "John Traveler",
        role: "INDIVIDUAL_TRAVELER",
      },
    ]

    const usersToInsert = await Promise.all(
      users.map(async (user) => ({
        email: user.email,
        name: user.name,
        password_hash: await hashPassword(user.password),
        role: user.role,
        company_id: user.company_id || null,
        preferred_language: "en",
        preferred_currency: "USD",
      })),
    )

    const { data: usersData, error: usersError } = await supabase.from("users").insert(usersToInsert)

    if (usersError) throw usersError
    console.log("[v0] Created 5 users with hashed passwords")

    // 6. Create Travel Requests
    console.log("[v0] Creating travel requests...")
    const travelRequests = [
      {
        user_id: 4,
        destination: "Rwanda",
        start_date: "2024-06-15",
        end_date: "2024-06-20",
        purpose: "Team building and adventure",
        status: "approved",
        budget_usd: 5000,
      },
      {
        user_id: 5,
        destination: "Paris",
        start_date: "2024-07-01",
        end_date: "2024-07-08",
        purpose: "Leisure travel",
        status: "pending",
        budget_usd: 4000,
      },
    ]

    const { data: requestsData, error: requestsError } = await supabase.from("travel_requests").insert(
      travelRequests.map((req) => ({
        user_id: req.user_id,
        destination: req.destination,
        start_date: req.start_date,
        end_date: req.end_date,
        purpose: req.purpose,
        status: req.status,
        budget_usd: req.budget_usd,
        created_at: new Date().toISOString(),
      })),
    )

    if (requestsError) throw requestsError
    console.log("[v0] Created 2 travel requests")

    // 7. Create Blog Posts
    console.log("[v0] Creating blog posts...")
    const blogPosts = [
      {
        title: "10 Best Destinations for Corporate Travel",
        slug: "best-destinations-corporate-travel",
        content: "Discover the top 10 destinations for productive corporate retreats...",
        author: "Sarah Johnson",
        language: "en",
        published: true,
        featured_image: "/blog/corporate-travel.jpg",
      },
      {
        title: "Les 10 meilleures destinations pour les voyages d'affaires",
        slug: "meilleures-destinations-voyages-affaires",
        content: "Découvrez les 10 meilleures destinations pour les retraites d'entreprise...",
        author: "Sarah Johnson",
        language: "fr",
        published: true,
        featured_image: "/blog/corporate-travel-fr.jpg",
      },
    ]

    const { data: blogData, error: blogError } = await supabase.from("blog_posts").insert(
      blogPosts.map((post) => ({
        title: post.title,
        slug: post.slug,
        content: post.content,
        author: post.author,
        language: post.language,
        published: post.published,
        featured_image: post.featured_image,
        created_at: new Date().toISOString(),
      })),
    )

    if (blogError) throw blogError
    console.log("[v0] Created 2 blog posts")

    console.log("[v0] Database seeding completed successfully!")
    console.log("[v0] Test credentials:")
    console.log("  Admin: admin@weofyou.com / Admin@123")
    console.log("  Travel Agent: sarah.agent@weofyou.com / Agent@123")
    console.log("  Corporate: company.admin1@tech.com / Corporate@123")
    console.log("  Employee: employee1@tech.com / Employee@123")
    console.log("  Traveler: john.traveler@email.com / Traveler@123")
  } catch (error) {
    console.error("[v0] Seeding error:", error.message)
    process.exit(1)
  }
}

seed()
