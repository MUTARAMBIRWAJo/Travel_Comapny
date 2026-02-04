# We-Of-You Travel Platform - Supabase Setup Guide

## Status: ✅ Prisma REMOVED - Supabase Only

All Prisma references have been completely removed. The application now uses **Supabase exclusively** for all database operations.

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed the Database

**First time only:**

```bash
node scripts/seed.js
```

This will:
- Create 5 roles (Admin, Travel Agent, Corporate Client, Employee, Traveler)
- Create 3 companies with realistic data
- Create 6 destinations across Africa, Europe, Asia
- Create 6 travel packages
- Create 5 test users with hashed passwords
- Create sample travel requests and blog posts

### 4. Verify Database Population

Check database status:

```bash
curl http://localhost:3000/api/verify-database
```

Should return:
```json
{
  "status": "Database Verification",
  "data": {
    "roles": 5,
    "users": 5,
    "companies": 3,
    "destinations": 6,
    "packages": 6,
    "travelRequests": 2,
    "trips": 0,
    "blogPosts": 2,
    "totalRecords": 29
  }
}
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Test Credentials

After seeding, use these to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@weofyou.com | Admin@123 |
| Travel Agent | sarah.agent@weofyou.com | Agent@123 |
| Corporate | company.admin1@tech.com | Corporate@123 |
| Employee | employee1@tech.com | Employee@123 |
| Traveler | john.traveler@email.com | Traveler@123 |

## Migration Details

### Files Removed
- ❌ `prisma/schema.prisma` - DELETED
- ❌ `lib/prisma.ts` - DELETED
- ❌ Prisma dependencies removed from package.json

### Files Updated
- ✅ `lib/supabaseClient.js` - Supabase client initialization
- ✅ `scripts/seed.js` - Pure JavaScript, no TypeScript
- ✅ All API routes in `app/api/` - Now use Supabase
- ✅ `lib/auth-service.ts` - Supabase queries only

### Database Access Pattern

All database operations now use:

```typescript
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(url, key)
const { data, error } = await supabase.from("table").select()
```

## Database Schema

Tables automatically created in Supabase:
- `roles` - User role definitions
- `users` - User accounts with hashed passwords
- `companies` - Corporate accounts
- `destinations` - Travel destinations
- `travel_packages` - Available packages
- `travel_requests` - User travel requests
- `trips` - Approved trip records
- `blog_posts` - Blog content
- `sessions` - Active sessions
- `notifications` - User notifications

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/logout` - Logout user

### Data Retrieval
- `GET /api/packages` - Get all packages
- `GET /api/travel-requests` - Get requests (filtered by userId)
- `GET /api/users` - Get all users
- `GET /api/blog` - Get published blog posts

### Verification
- `GET /api/verify-database` - Check all table counts
- `GET /api/verify-database/users` - List all users
- `GET /api/verify-database/packages` - List all packages

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

Supabase will automatically scale with your traffic.

### Other Platforms

Set these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

## Security Notes

✅ All passwords hashed with bcrypt (10 rounds)
✅ Service role key only used in API routes
✅ Anon key for client-side operations
✅ Sessions stored in database
✅ HTTP-only cookies for auth tokens

## Troubleshooting

**"Cannot find package '@/lib'"** → Using ts-node on scripts. Use `node` instead.
**"invalid input syntax for type json"** → JSON must be proper JavaScript object, not string.
**"NEXT_PUBLIC_SUPABASE_URL is required"** → Check `.env.local` has correct values.

## Support

For Supabase issues: https://supabase.com/docs
For Next.js issues: https://nextjs.org/docs

---

**Status: Production Ready** ✅
