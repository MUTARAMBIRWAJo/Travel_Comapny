import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

async function seed() {
  console.log("[v0] Starting database seed...")

  try {
    // 1. Clear existing data
    console.log("[v0] Clearing existing data...")
    await prisma.notification.deleteMany({})
    await prisma.sustainabilityReport.deleteMany({})
    await prisma.invoice.deleteMany({})
    await prisma.trip.deleteMany({})
    await prisma.travelRequest.deleteMany({})
    await prisma.blogPost.deleteMany({})
    await prisma.package.deleteMany({})
    await prisma.destination.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.company.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.role.deleteMany({})
    console.log("[v0] Cleared all tables")

    // 2. Create Roles
    console.log("[v0] Creating roles...")
    const roles = await Promise.all([
      prisma.role.create({
        data: {
          name: "ADMIN",
          permissions: JSON.stringify(["manage_users", "manage_companies", "view_analytics", "manage_content"]),
          description: "System administrator with full access",
        },
      }),
      prisma.role.create({
        data: {
          name: "TRAVEL_AGENT",
          permissions: JSON.stringify(["manage_requests", "view_requests", "approve_requests", "communicate_clients"]),
          description: "Travel agent managing client requests",
        },
      }),
      prisma.role.create({
        data: {
          name: "CORPORATE_CLIENT",
          permissions: JSON.stringify(["manage_employees", "view_analytics", "manage_policy", "view_requests"]),
          description: "Corporate account manager",
        },
      }),
      prisma.role.create({
        data: {
          name: "CORPORATE_EMPLOYEE",
          permissions: JSON.stringify(["view_requests", "create_requests", "view_trips"]),
          description: "Corporate employee",
        },
      }),
      prisma.role.create({
        data: {
          name: "INDIVIDUAL_TRAVELER",
          permissions: JSON.stringify(["view_packages", "create_requests", "manage_profile"]),
          description: "Individual traveler",
        },
      }),
    ])
    console.log("[v0] Created 5 roles")

    // 3. Create Companies
    console.log("[v0] Creating companies...")
    const companies = await Promise.all([
      prisma.company.create({
        data: {
          name: "TechCorp International",
          email: "hr@techcorp.com",
          phone: "+1-202-555-0142",
          address: "123 Tech Avenue, San Francisco, CA 94105",
          country: "USA",
          travelPolicy: JSON.stringify({
            maxBudget: 5000,
            requiresApproval: true,
            allowedDestinations: ["France", "Rwanda", "Maldives"],
          }),
          esgSettings: JSON.stringify({
            carbonTarget: 100,
            offsetPercentage: 50,
            sustainableOnly: false,
          }),
          employees: 500,
          subscriptionTier: "enterprise",
        },
      }),
      prisma.company.create({
        data: {
          name: "Global Finance Ltd",
          email: "travel@globalfinance.com",
          phone: "+44-20-7946-0958",
          address: "456 Financial Plaza, London, UK",
          country: "UK",
          travelPolicy: JSON.stringify({
            maxBudget: 3000,
            requiresApproval: true,
            allowedDestinations: ["France", "Tanzania"],
          }),
          esgSettings: JSON.stringify({
            carbonTarget: 50,
            offsetPercentage: 75,
            sustainableOnly: true,
          }),
          employees: 300,
          subscriptionTier: "professional",
        },
      }),
      prisma.company.create({
        data: {
          name: "Creative Solutions Inc",
          email: "admin@creativesolutions.com",
          phone: "+1-206-555-0123",
          address: "789 Innovation Way, Seattle, WA 98101",
          country: "USA",
          travelPolicy: JSON.stringify({
            maxBudget: 2000,
            requiresApproval: false,
            allowedDestinations: ["France", "Costa Rica"],
          }),
          esgSettings: JSON.stringify({
            carbonTarget: 30,
            offsetPercentage: 100,
            sustainableOnly: true,
          }),
          employees: 150,
          subscriptionTier: "standard",
        },
      }),
    ])
    console.log("[v0] Created 3 companies")

    // 4. Create Users
    console.log("[v0] Creating users...")
    const adminPasswordHash = await hashPassword("Admin@123")
    const agentPasswordHash = await hashPassword("Agent@123")
    const corporatePasswordHash = await hashPassword("Corporate@123")
    const employeePasswordHash = await hashPassword("Employee@123")
    const travelerPasswordHash = await hashPassword("Traveler@123")

    const users = await Promise.all([
      // Admin user
      prisma.user.create({
        data: {
          email: "admin@weofyou.com",
          passwordHash: adminPasswordHash,
          name: "Admin User",
          phone: "+1-800-555-0199",
          role: "ADMIN",
          roleId: roles[0].id,
          preferredLanguage: "EN",
          preferredCurrency: "USD",
          profileImage: "/avatars/admin.jpg",
          bio: "System administrator",
          status: "active",
          emailVerified: true,
        },
      }),
      // Travel Agent
      prisma.user.create({
        data: {
          email: "sarah.agent@weofyou.com",
          passwordHash: agentPasswordHash,
          name: "Sarah Johnson",
          phone: "+1-202-555-0173",
          role: "TRAVEL_AGENT",
          roleId: roles[1].id,
          preferredLanguage: "EN",
          preferredCurrency: "USD",
          profileImage: "/avatars/sarah.jpg",
          bio: "Senior Travel Agent",
          status: "active",
          emailVerified: true,
        },
      }),
      // Corporate Client Admin
      prisma.user.create({
        data: {
          email: "company.admin1@tech.com",
          passwordHash: corporatePasswordHash,
          name: "Michael Chen",
          phone: "+1-415-555-0123",
          companyId: companies[0].id,
          role: "CORPORATE_CLIENT",
          roleId: roles[2].id,
          preferredLanguage: "EN",
          preferredCurrency: "USD",
          profileImage: "/avatars/michael.jpg",
          bio: "TechCorp Travel Manager",
          status: "active",
          emailVerified: true,
        },
      }),
      // Corporate Employee
      prisma.user.create({
        data: {
          email: "employee1@tech.com",
          passwordHash: employeePasswordHash,
          name: "John Smith",
          phone: "+1-415-555-0124",
          companyId: companies[0].id,
          role: "CORPORATE_EMPLOYEE",
          roleId: roles[3].id,
          preferredLanguage: "EN",
          preferredCurrency: "USD",
          profileImage: "/avatars/john.jpg",
          bio: "Software Engineer at TechCorp",
          status: "active",
          emailVerified: true,
        },
      }),
      // Individual Traveler
      prisma.user.create({
        data: {
          email: "john.traveler@email.com",
          passwordHash: travelerPasswordHash,
          name: "John Doe",
          phone: "+1-555-0199",
          role: "INDIVIDUAL_TRAVELER",
          roleId: roles[4].id,
          preferredLanguage: "EN",
          preferredCurrency: "USD",
          profileImage: "/avatars/johndoe.jpg",
          bio: "Adventure travel enthusiast",
          status: "active",
          emailVerified: true,
        },
      }),
    ])
    console.log("[v0] Created 5 users")

    // 5. Create Destinations
    console.log("[v0] Creating destinations...")
    const destinations = await Promise.all([
      prisma.destination.create({
        data: {
          name: "Kigali",
          country: "Rwanda",
          region: "Central Africa",
          currency: "RWF",
          timezone: "Africa/Kigali",
          imageUrl: "/destinations/kigali.jpg",
          summary: "Capital of Rwanda, gateway to mountain gorillas",
        },
      }),
      prisma.destination.create({
        data: {
          name: "Paris",
          country: "France",
          region: "Western Europe",
          currency: "EUR",
          timezone: "Europe/Paris",
          imageUrl: "/destinations/paris.jpg",
          summary: "City of Light - romance, art, and culture",
        },
      }),
      prisma.destination.create({
        data: {
          name: "Maldives",
          country: "Maldives",
          region: "Indian Ocean",
          currency: "USD",
          timezone: "Indian/Maldives",
          imageUrl: "/destinations/maldives.jpg",
          summary: "Paradise islands with crystal waters and coral reefs",
        },
      }),
      prisma.destination.create({
        data: {
          name: "Dar es Salaam",
          country: "Tanzania",
          region: "East Africa",
          currency: "TZS",
          timezone: "Africa/Dar_es_Salaam",
          imageUrl: "/destinations/tanzania.jpg",
          summary: "Beach city and gateway to Serengeti and Zanzibar",
        },
      }),
      prisma.destination.create({
        data: {
          name: "San José",
          country: "Costa Rica",
          region: "Central America",
          currency: "USD",
          timezone: "America/Costa_Rica",
          imageUrl: "/destinations/costarica.jpg",
          summary: "Eco-tourism paradise with rainforests and beaches",
        },
      }),
    ])
    console.log("[v0] Created 5 destinations")

    // 6. Create Travel Packages
    console.log("[v0] Creating travel packages...")
    await Promise.all([
      prisma.package.create({
        data: {
          title: "Gorilla Trekking Adventure",
          category: "Adventure",
          description: "Trek through misty mountains to encounter mountain gorillas in their natural habitat",
          descriptionFr: "Randonnée avec les gorilles des montagnes dans leur habitat naturel",
          descriptionKin: "Kumurika ibinyamabanga mu mahoro yabo",
          priceUsd: 3500,
          duration: 7,
          destinationId: destinations[0].id,
          imageUrl: "/packages/gorillas.jpg",
          includesVisa: true,
          esgScore: 2.5,
        },
      }),
      prisma.package.create({
        data: {
          title: "Parisian Romance Package",
          category: "Honeymoon",
          description: "Experience the magic of Paris with luxury hotels and gourmet dining",
          descriptionFr: "Expérience magique de Paris avec hôtels de luxe et gastronomie",
          descriptionKin: "Ubwiyunge bw'i Paris umwiza n'ihoteri z'akamaro k'ineza",
          priceUsd: 2800,
          duration: 5,
          destinationId: destinations[1].id,
          imageUrl: "/packages/paris.jpg",
          includesVisa: false,
          esgScore: 1.8,
        },
      }),
      prisma.package.create({
        data: {
          title: "Maldives Luxury Escape",
          category: "Luxury",
          description: "All-inclusive luxury resort experience in the Maldives with water sports",
          descriptionFr: "Expérience de luxe tout inclus aux Maldives",
          descriptionKin: "Ubwiyunge bw'akamaro k'ineza mu Maldives",
          priceUsd: 4500,
          duration: 6,
          destinationId: destinations[2].id,
          imageUrl: "/packages/maldives.jpg",
          includesVisa: true,
          esgScore: 3.2,
        },
      }),
      prisma.package.create({
        data: {
          title: "Tanzania Safari Explorer",
          category: "Adventure",
          description: "Witness the greatest wildlife migration and explore Serengeti's diverse ecosystems",
          descriptionFr: "Explorez la plus grande migration animale et les écosystèmes du Serengeti",
          descriptionKin: "Reba uko Serengeti ubwiyunge bw'ubwinyamabanga",
          priceUsd: 3200,
          duration: 8,
          destinationId: destinations[3].id,
          imageUrl: "/packages/safari.jpg",
          includesVisa: true,
          esgScore: 2.1,
        },
      }),
      prisma.package.create({
        data: {
          title: "Costa Rica Eco-Tour",
          category: "Adventure",
          description: "Explore rainforests, zip-line through canopies, and relax on pristine beaches",
          descriptionFr: "Explorez les forêts tropicales et les plages du Costa Rica",
          descriptionKin: "Reba Itorero ryaho rya Costa Rica",
          priceUsd: 2200,
          duration: 6,
          destinationId: destinations[4].id,
          imageUrl: "/packages/costarica.jpg",
          includesVisa: false,
          esgScore: 1.5,
        },
      }),
    ])
    console.log("[v0] Created 5 travel packages")

    // 7. Create Travel Requests
    console.log("[v0] Creating travel requests...")
    const now = new Date()
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    await Promise.all([
      prisma.travelRequest.create({
        data: {
          userId: users[1].id,
          companyId: companies[0].id,
          packageId: destinations[0].id,
          type: "leisure",
          destination: "Rwanda",
          departureDate: nextMonth,
          returnDate: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
          status: "APPROVED",
          assignedAgentId: users[1].id,
          budget: 4000,
          currency: "USD",
        },
      }),
      prisma.travelRequest.create({
        data: {
          userId: users[3].id,
          companyId: companies[0].id,
          type: "corporate",
          destination: "France",
          departureDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
          returnDate: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
          status: "PENDING",
          assignedAgentId: users[1].id,
          budget: 2500,
          currency: "USD",
        },
      }),
      prisma.travelRequest.create({
        data: {
          userId: users[4].id,
          type: "leisure",
          destination: "Maldives",
          departureDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          returnDate: new Date(now.getTime() + 66 * 24 * 60 * 60 * 1000),
          status: "APPROVED",
          assignedAgentId: users[1].id,
          budget: 5000,
          currency: "USD",
        },
      }),
    ])
    console.log("[v0] Created 3 travel requests")

    // 8. Create Trips
    console.log("[v0] Creating trips...")
    const travelRequests = await prisma.travelRequest.findMany()

    await Promise.all([
      prisma.trip.create({
        data: {
          requestId: travelRequests[0].id,
          userId: users[1].id,
          companyId: companies[0].id,
          itinerary: JSON.stringify({
            day1: "Arrive in Kigali, hotel check-in",
            day2: "Gorilla trekking expedition",
            day3: "Volcanoes National Park tour",
            day4: "Local market and cultural experience",
          }),
          carbonFootprint: 2.1,
          status: "confirmed",
        },
      }),
      prisma.trip.create({
        data: {
          requestId: travelRequests[2].id,
          userId: users[4].id,
          itinerary: JSON.stringify({
            day1: "Arrive at Maldives resort",
            day2: "Snorkeling and diving",
            day3: "Island hopping tour",
            day4: "Spa and relaxation",
            day5: "Beach activities",
            day6: "Departure",
          }),
          carbonFootprint: 3.5,
          status: "confirmed",
        },
      }),
    ])
    console.log("[v0] Created 2 trips")

    // 9. Create Invoices
    console.log("[v0] Creating invoices...")
    const trips = await prisma.trip.findMany()

    await Promise.all([
      prisma.invoice.create({
        data: {
          tripId: trips[0].id,
          amount: 3500,
          currency: "USD",
          status: "paid",
          dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.invoice.create({
        data: {
          tripId: trips[1].id,
          amount: 4500,
          currency: "USD",
          status: "pending",
          dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        },
      }),
    ])
    console.log("[v0] Created 2 invoices")

    // 10. Create Blog Posts
    console.log("[v0] Creating blog posts...")
    await Promise.all([
      prisma.blogPost.create({
        data: {
          title: "Top 10 Sustainable Travel Destinations",
          titleFr: "Top 10 destinations de voyage durable",
          titleKin: "Aho 10 yo inzira nziza z'ubwiyunge",
          slug: "sustainable-travel-destinations",
          content: "Discover the world's most eco-friendly travel destinations...",
          contentFr: "Découvrez les destinations les plus écologiques...",
          contentKin: "Menya mu mahoro y'ubwiyunge bw'amabwinyamabanga...",
          excerpt: "Learn about sustainable tourism",
          excerptFr: "En savoir plus sur le tourisme durable",
          excerptKin: "Menya mu mategeko y'ubwiyunge",
          category: "SUSTAINABILITY",
          authorId: users[0].id,
          imageUrl: "/blog/sustainable.jpg",
          published: true,
        },
      }),
      prisma.blogPost.create({
        data: {
          title: "Culture and Heritage: Rwanda's Hidden Gems",
          titleFr: "Culture et patrimoine: les joyaux cachés du Rwanda",
          titleKin: "Umuco no umuco: ubwiyunge bw'u Rwanda",
          slug: "rwanda-culture-heritage",
          content: "Explore Rwanda's rich cultural heritage and historical sites...",
          contentFr: "Explorez le riche patrimoine culturel du Rwanda...",
          contentKin: "Reba umuco wo mu Rwanda...",
          excerpt: "Discover Rwanda's cultural treasures",
          excerptFr: "Découvrez les trésors culturels du Rwanda",
          excerptKin: "Reba umuco w'u Rwanda",
          category: "DESTINATION_GUIDE",
          authorId: users[0].id,
          imageUrl: "/blog/rwanda.jpg",
          published: true,
        },
      }),
    ])
    console.log("[v0] Created 2 blog posts")

    // 11. Create Notifications
    console.log("[v0] Creating notifications...")
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: users[1].id,
          type: "in_app",
          title: "New Travel Request",
          message: "You have a new travel request awaiting approval",
          actionUrl: "/dashboard/agent/requests",
        },
      }),
      prisma.notification.create({
        data: {
          userId: users[3].id,
          type: "email",
          title: "Trip Confirmed",
          message: "Your Rwanda gorilla trekking adventure has been confirmed",
          actionUrl: "/dashboard/employee/trips",
          read: true,
        },
      }),
    ])
    console.log("[v0] Created 2 notifications")

    // 12. Create Sustainability Reports
    console.log("[v0] Creating sustainability reports...")
    await Promise.all([
      prisma.sustainabilityReport.create({
        data: {
          companyId: companies[0].id,
          tripCount: 5,
          carbonTotal: 12.5,
          esgScore: 78,
          offsetAmount: 625,
          reportPeriod: "2024-01",
        },
      }),
      prisma.sustainabilityReport.create({
        data: {
          companyId: companies[1].id,
          tripCount: 3,
          carbonTotal: 8.2,
          esgScore: 82,
          offsetAmount: 410,
          reportPeriod: "2024-01",
        },
      }),
    ])
    console.log("[v0] Created 2 sustainability reports")

    console.log("[v0] DATABASE SEEDING COMPLETED SUCCESSFULLY!")
    console.log("[v0] Sample data has been populated across all tables")
    console.log("[v0] Test credentials:")
    console.log("[v0]   Admin: admin@weofyou.com / Admin@123")
    console.log("[v0]   Travel Agent: sarah.agent@weofyou.com / Agent@123")
    console.log("[v0]   Corporate: company.admin1@tech.com / Corporate@123")
    console.log("[v0]   Employee: employee1@tech.com / Employee@123")
    console.log("[v0]   Traveler: john.traveler@email.com / Traveler@123")
  } catch (error) {
    console.error("[v0] Seeding error:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
