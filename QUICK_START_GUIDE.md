# Quick Start Guide - We-Of-You Travel Platform

## 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database URL (Supabase, Neon, or local)

### Step 1: Install & Configure (2 minutes)
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your DATABASE_URL
# Example: postgresql://user:password@host/dbname
```

### Step 2: Database Setup (2 minutes)
```bash
# Run migrations to create tables
npx prisma migrate deploy

# Seed database with sample data
npm run seed
```

### Step 3: Start Development (1 minute)
```bash
# Start local dev server
npm run dev

# Open browser to http://localhost:3000
```

## Test It Out

### Visit Key Pages
- Home: http://localhost:3000
- Packages: http://localhost:3000/packages (loads 6 packages from DB)
- Verify DB: http://localhost:3000/verify-db (shows database status)

### Login as Admin
- Email: admin@weofyou.com
- Password: password123
- Redirects to: http://localhost:3000/dashboard/admin

### Login as Traveler
- Email: john.traveler@email.com
- Password: password123
- Redirects to: http://localhost:3000/dashboard/traveler

## Complete Credential List

```
Admin:              admin@weofyou.com / password123
Travel Agent:       sarah.agent@weofyou.com / password123
Corporate Client:   company.admin1@tech.com / password123
Corporate Employee: employee1@tech.com / password123
Individual Traveler: john.traveler@email.com / password123

All use password: password123
```

## Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to vercel.com/new
3. Import your GitHub repository
4. Add environment variables:
   - DATABASE_URL = your PostgreSQL URL
5. Click Deploy

Done! Your app is live! 🎉

## Database Status

After seeding, you'll have:
- ✓ 10 users across all roles
- ✓ 6 travel packages
- ✓ 3 companies
- ✓ 6 destinations
- ✓ 5 travel requests
- ✓ 2 confirmed trips
- ✓ 5 blog posts
- ✓ Sample invoices & notifications

Check status anytime: http://localhost:3000/verify-db

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Check for errors
npm run build           # Build for production
npm start               # Start production server

# Database
npm run seed            # Reseed database with sample data
npx prisma studio      # Open database GUI
npx prisma migrate dev  # Create new migration
npx prisma migrate reset # Reset database (deletes all data!)
```

## Troubleshooting

**"DATABASE_URL not found"**
- Set DATABASE_URL in .env.local before running seed

**"relation 'Role' does not exist"**
- Run: npx prisma migrate deploy

**Port 3000 already in use**
- Run: npm run dev -- -p 3001

**Need to reset and reseed**
- Run: npx prisma migrate reset && npm run seed

## Next Steps

- [ ] Customize branding and colors
- [ ] Add your company logo
- [ ] Configure email provider
- [ ] Set up payment processing
- [ ] Deploy to production
- [ ] Monitor with Vercel Analytics

## Support

For issues:
1. Check .env.local has DATABASE_URL
2. Verify database is accessible
3. Run migrations: npx prisma migrate deploy
4. Reseed: npm run seed
5. Check /verify-db for database status

Happy travels! 🌍✈️
