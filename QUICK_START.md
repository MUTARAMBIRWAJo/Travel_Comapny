# Quick Start Guide - We-Of-You Travel Platform

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[id].supabase.co:5432/postgres
```

### 3. Create Database Tables
```bash
npx prisma migrate dev
```

### 4. Seed Sample Data
```bash
npm run seed
```

### 5. Verify Everything Works
```bash
npm run dev
# Visit http://localhost:3000/verify-db
```

## Test Login Immediately

After seeding, visit `http://localhost:3000/login` and try:

- **Admin**: `admin@weofyou.com` / `Admin@123`
- **Traveler**: `john.traveler@email.com` / `Traveler@123`

## Verify Data in Database

Go to: `http://localhost:3000/verify-db`

You'll see:
- ✅ All 11 tables populated
- ✅ 41+ sample records
- ✅ Test credentials
- ✅ User list
- ✅ Package list

## Access Dashboards

After login, you can access:
- `/dashboard/admin` - Admin dashboard
- `/dashboard/agent` - Travel agent dashboard
- `/dashboard/traveler` - Traveler dashboard
- `/dashboard/corporate-client` - Corporate dashboard
- `/dashboard/employee` - Employee dashboard

## Troubleshooting

**Error: "relation does not exist"**
→ Run: `npx prisma migrate dev`

**Error: "Missing Supabase credentials"**
→ Check `.env.local` file has all values

**Database connection failed**
→ Verify `DATABASE_URL` is correct in `.env.local`

**No data showing**
→ Visit `/verify-db` and check the status
→ Run: `npm run seed` again

## Full Documentation

- [SEED_DATABASE.md](./SEED_DATABASE.md) - Detailed seeding guide
- [README.md](./README.md) - Complete project documentation
- [DATABASE_STATUS.md](./DATABASE_STATUS.md) - Current status report

---

**Ready?** Run `npm run dev` and start exploring!
