const path = require('path');
// Load .env first (canonical), then .local.env (local overrides)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') });
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.error('[v0] Missing DATABASE_URL or SUPABASE_DB_URL. Add to .env or .local.env.');
  process.exit(1);
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function seed() {
  try {
    await client.connect();
    console.log('[v0] Starting database seed with PostgreSQL...');

    // 1. Create Roles
    console.log('[v0] Creating roles...');
    const roles = [
      {
        name: 'ADMIN',
        permissions: ['manage_users', 'manage_companies', 'view_analytics', 'manage_content'],
        description: 'System administrator with full access',
      },
      {
        name: 'TRAVEL_AGENT',
        permissions: ['manage_requests', 'view_requests', 'approve_requests', 'communicate_clients'],
        description: 'Travel agent managing client requests',
      },
      {
        name: 'CORPORATE_CLIENT',
        permissions: ['manage_employees', 'view_analytics', 'manage_policy', 'view_requests'],
        description: 'Corporate account manager',
      },
      {
        name: 'CORPORATE_EMPLOYEE',
        permissions: ['view_requests', 'create_requests', 'view_trips'],
        description: 'Corporate employee',
      },
      {
        name: 'INDIVIDUAL_TRAVELER',
        permissions: ['view_packages', 'create_requests', 'manage_profile'],
        description: 'Individual traveler',
      },
    ];

    for (const role of roles) {
      const query = `
        INSERT INTO roles (name, permissions, description, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (name) DO UPDATE SET
          permissions = EXCLUDED.permissions,
          description = EXCLUDED.description,
          updated_at = EXCLUDED.updated_at
      `;
      await client.query(query, [role.name, JSON.stringify(role.permissions), role.description, new Date(), new Date()]);
    }
    console.log('[v0] Created 5 roles');

    // 2. Create Companies
    console.log('[v0] Creating companies...');
    const companies = [
      {
        name: 'TechCorp International',
        email: 'hr@techcorp.com',
        phone: '+1-202-555-0142',
        address: '123 Tech Avenue, San Francisco, CA 94105',
        country: 'USA',
        industry: 'Technology',
        employees_count: 5000,
      },
      {
        name: 'Global Finance Ltd',
        email: 'hr@globalfinance.com',
        phone: '+44-20-7946-0958',
        address: '456 Finance Street, London, UK',
        country: 'United Kingdom',
        industry: 'Financial Services',
        employees_count: 3000,
      },
      {
        name: 'Creative Solutions Inc',
        email: 'hr@creativesolutions.com',
        phone: '+61-2-9248-8100',
        address: '789 Innovation Way, Sydney, Australia',
        country: 'Australia',
        industry: 'Creative Services',
        employees_count: 500,
      },
    ];

    for (const company of companies) {
      const query = `
        INSERT INTO companies (name, email, phone, address, country, industry, employees_count, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await client.query(query, [
        company.name, company.email, company.phone, company.address,
        company.country, company.industry, company.employees_count,
        new Date(), new Date()
      ]);
    }
    console.log('[v0] Created 3 companies');

    // 3. Create Destinations
    console.log('[v0] Creating destinations...');
    const destinations = [
      {
        name: 'Rwanda',
        country: 'Rwanda',
        region: 'East Africa',
        description: 'Discover the land of a thousand hills with stunning landscapes and wildlife.',
        climate: 'Tropical',
        best_season: 'Jun-Sep',
        currency: 'RWF',
        language: 'Kinyarwanda',
        attractions: ['Volcanoes National Park', 'Serengeti', 'Kigali Genocide Memorial'],
      },
      {
        name: 'Paris',
        country: 'France',
        region: 'Western Europe',
        description: 'Experience the City of Light with iconic landmarks and world-class culture.',
        climate: 'Temperate',
        best_season: 'May-Sep',
        currency: 'EUR',
        language: 'French',
        attractions: ['Eiffel Tower', 'Louvre', 'Notre-Dame'],
      },
      {
        name: 'Maldives',
        country: 'Maldives',
        region: 'South Asia',
        description: 'Relax in the most exclusive tropical paradise with crystal-clear waters.',
        climate: 'Tropical',
        best_season: 'Nov-Apr',
        currency: 'MVR',
        language: 'Dhivehi',
        attractions: ['Coral Reefs', 'Water Villas', 'Snorkeling'],
      },
      {
        name: 'Tanzania',
        country: 'Tanzania',
        region: 'East Africa',
        description: 'Witness the great migration and explore pristine natural beauty.',
        climate: 'Subtropical',
        best_season: 'Jun-Oct',
        currency: 'TZS',
        language: 'Swahili',
        attractions: ['Mount Kilimanjaro', 'Serengeti', 'Zanzibar'],
      },
      {
        name: 'Costa Rica',
        country: 'Costa Rica',
        region: 'Central America',
        description: 'Explore biodiversity hotspot with adventure and eco-tourism.',
        climate: 'Tropical',
        best_season: 'Dec-Apr',
        currency: 'CRC',
        language: 'Spanish',
        attractions: ['Cloud Forests', 'Beaches', 'Wildlife'],
      },
      {
        name: 'Japan',
        country: 'Japan',
        region: 'East Asia',
        description: 'Experience tradition and modernity in the land of the rising sun.',
        climate: 'Temperate',
        best_season: 'Mar-May',
        currency: 'JPY',
        language: 'Japanese',
        attractions: ['Mount Fuji', 'Tokyo', 'Kyoto Temples'],
      },
    ];

    for (const dest of destinations) {
      const query = `
        INSERT INTO destinations (name, country, region, description, climate, best_season, currency, language, attractions, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;
      await client.query(query, [
        dest.name, dest.country, dest.region, dest.description,
        dest.climate, dest.best_season, dest.currency, dest.language,
        JSON.stringify(dest.attractions), new Date(), new Date()
      ]);
    }
    console.log('[v0] Created 6 destinations');

    // 4. Create Travel Packages
    console.log('[v0] Creating travel packages...');
    const packages = [
      {
        name: 'Rwanda Adventure',
        destination: 'Rwanda',
        duration_days: 5,
        price_usd: 2500,
        description: 'Explore the stunning landscapes and wildlife of Rwanda.',
        included_services: ['Accommodation in luxury hotel', 'Guided tours', 'Transportation', 'Meals'],
        difficulty_level: 'Moderate',
        max_group_size: 15,
      },
      {
        name: 'Paris Romance',
        destination: 'Paris',
        duration_days: 7,
        price_usd: 3500,
        description: 'Experience the magic of Paris with cultural tours and dining.',
        included_services: [' 4-star hotel', 'City tours', 'Museum passes', 'Dining credits'],
        difficulty_level: 'Easy',
        max_group_size: 20,
      },
      {
        name: 'Maldives Paradise',
        destination: 'Maldives',
        duration_days: 10,
        price_usd: 5000,
        description: 'Luxury resort experience in the Maldives.',
        included_services: ['Water villa', 'All-inclusive meals', 'Spa', 'Water activities'],
        difficulty_level: 'Easy',
        max_group_size: 10,
      },
      {
        name: 'Tanzania Safari',
        destination: 'Tanzania',
        duration_days: 8,
        price_usd: 4000,
        description: 'Experience the great migration and wildlife safari.',
        included_services: ['Safari lodge', 'Game drives', 'Professional guide', 'Meals'],
        difficulty_level: 'Moderate',
        max_group_size: 12,
      },
      {
        name: 'Costa Rica Eco-Tour',
        destination: 'Costa Rica',
        duration_days: 6,
        price_usd: 3000,
        description: 'Eco-tourism adventure in the cloud forests.',
        included_services: ['Eco-lodge', 'Guided hikes', 'Wildlife tours', 'Meals'],
        difficulty_level: 'Moderate',
        max_group_size: 16,
      },
      {
        name: 'Japan Discovery',
        destination: 'Japan',
        duration_days: 10,
        price_usd: 4500,
        description: 'Traditional and modern Japan experience.',
        included_services: ['Hotels', 'Train pass', 'Guided tours', 'Meals'],
        difficulty_level: 'Easy',
        max_group_size: 18,
      },
    ];

    for (const pkg of packages) {
      const query = `
        INSERT INTO travel_packages (name, destination, duration_days, price_usd, description, included_services, difficulty_level, max_group_size, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      await client.query(query, [
        pkg.name, pkg.destination, pkg.duration_days, pkg.price_usd,
        pkg.description, JSON.stringify(pkg.included_services),
        pkg.difficulty_level, pkg.max_group_size, new Date(), new Date()
      ]);
    }
    console.log('[v0] Created 6 travel packages');

    // 5. Create Users with HASHED passwords
    console.log('[v0] Creating users with hashed passwords...');
    const users = [
      {
        email: 'admin@weofyou.com',
        password: 'Admin@123',
        name: 'Admin User',
        role: 'ADMIN',
      },
      {
        email: 'sarah.agent@weofyou.com',
        password: 'Agent@123',
        name: 'Sarah Johnson',
        role: 'TRAVEL_AGENT',
      },
      {
        email: 'company.admin1@tech.com',
        password: 'Corporate@123',
        name: 'Mike Thompson',
        role: 'CORPORATE_CLIENT',
        company_id: 1,
      },
      {
        email: 'employee1@tech.com',
        password: 'Employee@123',
        name: 'John Smith',
        role: 'CORPORATE_EMPLOYEE',
        company_id: 1,
      },
      {
        email: 'john.traveler@email.com',
        password: 'Traveler@123',
        name: 'John Traveler',
        role: 'INDIVIDUAL_TRAVELER',
      },
    ];

    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      const query = `
        INSERT INTO users (email, name, password_hash, role, company_id, preferred_language, preferred_currency, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await client.query(query, [
        user.email, user.name, hashedPassword, user.role,
        user.company_id || null, 'en', 'USD', new Date(), new Date()
      ]);
    }
    console.log('[v0] Created 5 users with hashed passwords');

    // 6. Create Travel Requests
    console.log('[v0] Creating travel requests...');
    const travelRequests = [
      {
        user_id: 4,
        destination: 'Rwanda',
        start_date: '2024-06-15',
        end_date: '2024-06-20',
        purpose: 'Team building and adventure',
        status: 'approved',
        budget_usd: 5000,
      },
      {
        user_id: 5,
        destination: 'Paris',
        start_date: '2024-07-01',
        end_date: '2024-07-08',
        purpose: 'Leisure travel',
        status: 'pending',
        budget_usd: 4000,
      },
    ];

    for (const req of travelRequests) {
      const query = `
        INSERT INTO travel_requests (user_id, destination, start_date, end_date, purpose, status, budget_usd, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await client.query(query, [
        req.user_id, req.destination, req.start_date, req.end_date,
        req.purpose, req.status, req.budget_usd, new Date(), new Date()
      ]);
    }
    console.log('[v0] Created 2 travel requests');

    // 7. Create Blog Posts
    console.log('[v0] Creating blog posts...');
    const blogPosts = [
      {
        title: '10 Best Destinations for Corporate Travel',
        slug: 'best-destinations-corporate-travel',
        content: 'Discover the top 10 destinations for productive corporate retreats...',
        author: 'Sarah Johnson',
        language: 'en',
        published: true,
        featured_image: '/blog/corporate-travel.jpg',
      },
      {
        title: 'Les 10 meilleures destinations pour les voyages d\'affaires',
        slug: 'meilleures-destinations-voyages-affaires',
        content: 'Découvrez les 10 meilleures destinations pour les retraites d\'entreprise...',
        author: 'Sarah Johnson',
        language: 'fr',
        published: true,
        featured_image: '/blog/corporate-travel-fr.jpg',
      },
    ];

    for (const post of blogPosts) {
      const query = `
        INSERT INTO blog_posts (title, slug, content, author, language, published, featured_image, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await client.query(query, [
        post.title, post.slug, post.content, post.author, post.language,
        post.published, post.featured_image, new Date(), new Date()
      ]);
    }
    console.log('[v0] Created 2 blog posts');

    console.log('[v0] Database seeding completed successfully!');
    console.log('[v0] Test credentials:');
    console.log('  Admin: admin@weofyou.com / Admin@123');
    console.log('  Travel Agent: sarah.agent@weofyou.com / Agent@123');
    console.log('  Corporate: company.admin1@tech.com / Corporate@123');
    console.log('  Employee: employee1@tech.com / Employee@123');
    console.log('  Traveler: john.traveler@email.com / Traveler@123');
  } catch (error) {
    console.error('[v0] Seeding error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
