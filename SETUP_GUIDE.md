# We-Of-You Travel Platform - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (Neon, Supabase, or local)
- Git

### Installation

1. **Clone/Download the project**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your `DATABASE_URL` for PostgreSQL
   - Update other configuration as needed

3. **Setup Database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run SQL schema from scripts/init-database.sql
   # Create the database tables in your PostgreSQL instance

   # Seed sample data
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000

## Demo Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@weofyou.com | password123 |
| Travel Agent | agent.sarah@weofyou.com | password123 |
| Individual Traveler | john.traveler@email.com | password123 |
| Corporate Admin | company.admin1@tech.com | password123 |
| Corporate Employee | employee1@tech.com | password123 |

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
1. Build: `npm run build`
2. Start: `npm run start`
3. Ensure DATABASE_URL environment variable is set

## Project Structure

```
we-of-you-travel/
├── app/
│   ├── (public pages)
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── agent/
│   │   ├── corporate-client/
│   │   ├── employee/
│   │   └── traveler/
│   ├── api/
│   │   ├── auth/
│   │   ├── travel-requests/
│   │   ├── packages/
│   │   └── blog/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── dashboard-sidebar.tsx
│   └── dashboard-header.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth-service.ts
│   └── i18n.ts
├── prisma/
│   └── schema.prisma
├── scripts/
│   ├── init-database.sql
│   └── seed.ts
└── public/
    └── (images & assets)
```

## Features

- ✅ Multi-role authentication (Admin, Agent, Corporate, Employee, Traveler)
- ✅ Travel request management system
- ✅ Travel packages & destinations catalog
- ✅ Corporate travel policy management
- ✅ Individual traveler profiles
- ✅ Blog system with multilingual support
- ✅ Notifications system
- ✅ ESG/Sustainability tracking
- ✅ Invoice & billing management
- ✅ Role-based dashboards
- ✅ Mobile-responsive design

## Support

For issues or questions, contact support@weofyou.com
```

```typescript file="" isHidden
