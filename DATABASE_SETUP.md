# Database Setup Guide for We-Of-You Travel Platform

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase, Neon, or local)
- Environment variables configured

## Step 1: Set Environment Variables

Create a `.env.local` file in the project root with your database connection:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## Step 2: Run Database Migrations

Prisma will create all tables based on the schema:

```bash
npx prisma migrate deploy
```

## Step 3: Seed Sample Data

Populate the database with realistic sample data:

```bash
# Using npm script
npm run seed

# Or using the shell script
bash scripts/run-seed.sh

# Or directly with ts-node
npx ts-node scripts/seed-data.ts
```

## Step 4: Verify Database

Start the application and visit the verification dashboard:

```bash
npm run dev
# Visit http://localhost:3000/verify-db
```

The dashboard will show:
- Table record counts
- Sample seeded data
- Test credentials
- Data integrity status

## Database Schema

The system includes the following tables:

- **roles** - User roles and permissions
- **users** - User accounts with credentials
- **companies** - Corporate client organizations
- **destinations** - Travel destinations
- **packages** - Travel packages
- **travel_requests** - Booking requests
- **trips** - Confirmed trips
- **invoices** - Trip invoices
- **blog_posts** - Blog content
- **notifications** - User notifications
- **sustainability_reports** - ESG tracking

## Seeded Data Summary

After seeding, the database will contain:
- 5 user roles
- 3 companies
- 6 destinations
- 6 travel packages
- 10 users across all roles
- 5 travel requests with mixed statuses
- 2 confirmed trips
- 5 blog posts in multiple languages
- Sample notifications and sustainability reports

## Test Credentials

After seeding, use these credentials to test different user roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@weofyou.com | password123 |
| Travel Agent | sarah.agent@weofyou.com | password123 |
| Corporate Client | company.admin1@tech.com | password123 |
| Corporate Employee | employee1@tech.com | password123 |
| Individual Traveler | john.traveler@email.com | password123 |

## Dashboard Access

After logging in, you'll be routed to the appropriate dashboard:

- Admin: `/dashboard/admin`
- Travel Agent: `/dashboard/agent`
- Corporate Client: `/dashboard/corporate-client`
- Corporate Employee: `/dashboard/employee`
- Individual Traveler: `/dashboard/traveler`

## Troubleshooting

### "relation 'Role' does not exist"

This means migrations haven't run. Execute:
```bash
npx prisma migrate deploy
```

### Connection timeout

Verify DATABASE_URL is correct and the database is accessible.

### Seed script fails

Check that all migrations passed and the database is in a clean state.

## Resetting the Database

To clear all data and reseed:

```bash
npx prisma migrate reset
npm run seed
```

⚠️ **Warning**: This will DELETE all data!
