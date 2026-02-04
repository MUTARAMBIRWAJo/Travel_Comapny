# Database Seeding Guide

This guide explains how to seed your We-Of-You Travel Platform database with sample data.

## Prerequisites

1. **Supabase Project Set Up** - Create a project at [supabase.com](https://supabase.com)
2. **Environment Variables** - Add your Supabase credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

3. **Database Tables Created** - Run Prisma migrations:

```bash
# This creates all necessary tables
npx prisma migrate dev
```

## Method 1: Automatic Seeding (Recommended)

Run the seed script:

```bash
npm run seed
```

This will:
- ✅ Insert 5 roles (Admin, Travel Agent, Corporate Client, Employee, Traveler)
- ✅ Insert 3 companies (TechCorp, Global Finance, Creative Solutions)
- ✅ Insert 11 users with different roles and demo passwords
- ✅ Insert 6 destinations (Rwanda, Paris, Maldives, Tanzania, Costa Rica)
- ✅ Insert 6 travel packages with multilingual support
- ✅ Insert 5 travel requests with various statuses
- ✅ Insert 3 trips for approved requests
- ✅ Insert 3 blog posts
- ✅ Insert sample notifications and sustainability reports

## Method 2: Manual Seeding via Supabase UI

1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Create a new query and paste the SQL from `scripts/001-init-database.sql`
4. Execute the query
5. Import CSV data for sample records using the Supabase import feature

## Verify Seeding was Successful

### Option A: Verification Dashboard (Recommended)
```bash
npm run dev
# Visit http://localhost:3000/verify-db
```

This will show:
- ✅ Total records in each table
- ✅ List of all seeded users with their roles
- ✅ All travel packages with prices and destinations
- ✅ Test login credentials

### Option B: Supabase Dashboard
1. Go to your Supabase project
2. Click "Table Editor"
3. Verify data exists in:
   - `Role` - Should have 5 records
   - `User` - Should have 11 records
   - `Company` - Should have 3 records
   - `Destination` - Should have 6 records
   - `Package` - Should have 6 records
   - `TravelRequest` - Should have 5 records
   - And other tables...

### Option C: API Check
```bash
curl http://localhost:3000/api/verify-database
```

Expected response:
```json
{
  "status": "Database Verification",
  "data": {
    "roles": 5,
    "users": 11,
    "companies": 3,
    "destinations": 6,
    "packages": 6,
    "travelRequests": 5,
    "trips": 2,
    "blogPosts": 3
  },
  "totalRecords": 41
}
```

## Test Login Credentials

After seeding, use these credentials to test the platform:

### Admin Dashboard
- Email: `admin@weofyou.com`
- Password: `Admin@123`
- Access: `/dashboard/admin`

### Travel Agent Dashboard
- Email: `sarah.agent@weofyou.com`
- Password: `Agent@123`
- Access: `/dashboard/agent`

### Corporate Client Dashboard
- Email: `company.admin1@tech.com`
- Password: `Corporate@123`
- Access: `/dashboard/corporate-client`

### Corporate Employee Dashboard
- Email: `employee1@tech.com`
- Password: `Employee@123`
- Access: `/dashboard/employee`

### Individual Traveler Dashboard
- Email: `john.traveler@email.com`
- Password: `Traveler@123`
- Access: `/dashboard/traveler`

## Troubleshooting

### Error: "relation does not exist"
- Run migrations: `npx prisma migrate dev`
- Ensure all tables are created in Supabase

### Error: "Missing Supabase credentials"
- Check `.env.local` has all required variables
- Get credentials from Supabase project settings

### Data not appearing after seeding
- Verify database connection: `curl http://localhost:3000/api/verify-database`
- Check Supabase project dashboard for data
- Try running seeding again

### Password not working
- Use the exact password from the test credentials
- Ensure you're using the correct email
- Check user status is "active"

## Next Steps

1. ✅ Verify all data appears at `/verify-db`
2. ✅ Test login with demo credentials
3. ✅ Explore different dashboards
4. ✅ Create new users/records as needed
5. ✅ Deploy to production

## Clear All Data (if needed)

To delete all data and start fresh:

```bash
# This will remove all records
npx prisma migrate reset

# Then seed again
npm run seed
```

## Production Deployment

Before deploying to production:

1. Update Supabase credentials in your hosting platform (Vercel, etc.)
2. Run migrations on production database
3. Run seed script on production (optional - customize for live data)
4. Verify data appears at `/verify-db`
5. Test with demo credentials

---

**Questions?** Check the main [README.md](./README.md) for more information.
