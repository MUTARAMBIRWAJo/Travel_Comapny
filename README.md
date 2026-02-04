# We-Of-You Travel & Experiences Ltd

A modern, production-ready travel management platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Multi-Role Dashboard System**: Admin, Travel Agent, Corporate Client, Corporate Employee, and Individual Traveler
- **Multilingual Support**: English, French, and Kinyarwanda with auto-detection and persistent preferences
- **Geo-Based Currency Switching**: Automatic currency conversion based on location
- **Travel Package Management**: Browse, book, and manage travel packages
- **Real-Time Notifications**: Email, SMS, and in-app notifications
- **AI Travel Assistant**: Natural language travel recommendations (ready for integration)
- **ESG Tracking**: Carbon footprint tracking and sustainability reporting
- **Secure Authentication**: Role-based access control with encrypted passwords
- **Responsive Design**: Mobile-first, fully responsive UI with Tailwind CSS
- **Complete Analytics**: Comprehensive dashboards with data visualization using Recharts

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Next.js API Routes with Node.js
- **Database**: PostgreSQL (Neon, Supabase, or self-hosted)
- **ORM**: Prisma with type-safe queries
- **Authentication**: Custom JWT session management with bcrypt password hashing
- **UI Components**: shadcn/ui components with Radix UI
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Deployment**: Vercel, AWS, Railway, DigitalOcean, Azure, or any Node.js host

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (Neon, Supabase, or local)
- Git

### Installation

1. **Clone/Download the project**
   ```bash
   cd we-of-you-travel
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Update with your database credentials:
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Initialize Database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run database schema
   npx prisma db push
   
   # Seed with sample data
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## Database Setup

### Option 1: Neon (Recommended)
1. Create account at https://neon.tech
2. Create a new project and copy connection string
3. Set as `DATABASE_URL` in `.env.local`
4. Run `npx prisma db push`
5. Seed with `npm run seed`

### Option 2: Supabase
1. Create project at https://supabase.com
2. Go to Settings → Database → Connection String (Transaction Pooler)
3. Set as `DATABASE_URL` in `.env.local`
4. Run `npx prisma db push` and `npm run seed`

### Option 3: Local PostgreSQL
1. Create database: `createdb we_of_you_travel`
2. Set connection: `postgresql://postgres:password@localhost:5432/we_of_you_travel`
3. Run migrations and seed

## Demo Credentials

After seeding, use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@weofyou.com | password123 |
| Travel Agent | agent.sarah@weofyou.com | password123 |
| Corporate Admin | company.admin1@tech.com | password123 |
| Corporate Employee | employee1@tech.com | password123 |
| Individual Traveler | john.traveler@email.com | password123 |

## Project Structure

```
we-of-you-travel/
├── app/
│   ├── (public pages)           # Home, About, Services, Packages, Blog, Contact
│   ├── api/                     # REST API routes
│   ├── auth/                    # Login, Signup pages
│   ├── dashboard/
│   │   ├── admin/               # Admin dashboard & management
│   │   ├── agent/               # Travel agent dashboard
│   │   ├── corporate-client/    # Corporate client dashboard
│   │   ├── employee/            # Employee travel portal
│   │   └── traveler/            # Individual traveler dashboard
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles & design tokens
│   └── page.tsx                 # Home page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── navbar.tsx               # Navigation
│   ├── footer.tsx               # Footer
│   ├── dashboard-sidebar.tsx    # Dashboard navigation
│   └── dashboard-header.tsx     # Dashboard header
├── lib/
│   ├── prisma.ts                # Prisma client singleton
│   ├── auth-service.ts          # Authentication utilities
│   ├── i18n.ts                  # Multilingual support
│   └── utils.ts                 # Utility functions
├── scripts/
│   ├── init-database.sql        # SQL schema (alternative to Prisma)
│   └── seed.ts                  # Sample data seeding
├── prisma/
│   └── schema.prisma            # Database schema
├── proxy.ts                     # Next.js middleware for auth
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS v4 config
├── tsconfig.json                # TypeScript config
├── package.json
└── README.md
```

## All Pages & Routes

### Public Pages
- `/` - Home with hero, features, packages
- `/about` - Company mission, values, team
- `/services` - Service offerings
- `/packages` - Travel packages catalog with filters
- `/blog` - Travel blog with multilingual content
- `/contact` - Contact form and office locations
- `/privacy` - Privacy policy
- `/terms` - Terms & conditions
- `/login` - User login
- `/signup` - User registration

### Protected Dashboards (Role-Based)
- `/dashboard/admin` - System admin panel
- `/dashboard/admin/users` - User management
- `/dashboard/admin/analytics` - System analytics
- `/dashboard/agent` - Travel agent portal
- `/dashboard/agent/requests` - Client requests
- `/dashboard/corporate-client` - Corporate admin
- `/dashboard/corporate-client/employees` - Team management
- `/dashboard/corporate-client/analytics` - Company analytics
- `/dashboard/corporate-client/esg` - ESG reports
- `/dashboard/employee` - Employee travel portal
- `/dashboard/employee/trips` - Trip history
- `/dashboard/traveler` - Individual traveler dashboard
- `/dashboard/traveler/trips` - Trip management

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Create new account
- `POST /api/auth/logout` - End session

### Data Access
- `GET /api/users` - Get all users (admin)
- `GET /api/travel-requests` - Get travel requests
- `POST /api/travel-requests` - Create new request
- `GET /api/packages` - Get travel packages
- `GET /api/blog` - Get blog posts

## Deployment

### Vercel (1-Click Deploy)
```bash
vercel deploy
```
Set environment variables in Vercel dashboard and deploy.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Other Platforms
Build: `npm run build`  
Start: `npm run start`

Deploy to AWS, Azure, Google Cloud, Railway, DigitalOcean, or any Node.js host.

## Key Features

✅ **Multi-Role Authentication** - 5 different user roles with custom permissions  
✅ **Complete Dashboards** - Role-specific interfaces for all user types  
✅ **Travel Management** - Request, approve, book, and track trips  
✅ **Package Catalog** - Browse and filter travel packages  
✅ **Corporate Features** - Employee management, travel policies, ESG tracking  
✅ **Analytics** - Real-time dashboards with charts and KPIs  
✅ **Notifications** - Email, SMS, and in-app alerts  
✅ **Blog System** - Content management with multiple languages  
✅ **Mobile Responsive** - Works perfectly on all devices  
✅ **Security** - Encrypted passwords, HTTPS, RBAC  
✅ **Production Ready** - Fully tested and optimized  

## Environment Variables

Create `.env.local`:

```env
# Required
DATABASE_URL=postgresql://user:password@host/database

# Optional
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Security

- Passwords hashed with bcryptjs (10 rounds)
- HTTPS required in production
- HTTP-only secure cookies for sessions
- CSRF protection via SameSite cookies
- Input validation and sanitization
- Role-based access control (RBAC)
- Database query parameterization
- Environment variable protection

## Performance

- Server-side rendering (SSR)
- Automatic image optimization
- Code splitting by route
- CSS minification
- Database query optimization
- Connection pooling
- Caching strategies

## Testing Demo Accounts

All demo accounts use password: `password123`

1. **Admin**: admin@weofyou.com
   - Full system access
   - User and content management
   - Analytics and reporting

2. **Travel Agent**: agent.sarah@weofyou.com
   - Client request management
   - Booking and itinerary creation
   - Communication with travelers

3. **Corporate Admin**: company.admin1@tech.com
   - Employee management
   - Travel policy configuration
   - ESG reporting

4. **Corporate Employee**: employee1@tech.com
   - Create travel requests
   - View approved trips
   - Access itineraries

5. **Individual Traveler**: john.traveler@email.com
   - Book travel
   - Manage trips
   - Download invoices

## Troubleshooting

### Database Connection Error
```bash
npx prisma validate
npx prisma db push --skip-generate
```

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Support

- **Documentation**: See SETUP_GUIDE.md and DEPLOYMENT.md
- **Email**: support@weofyou.com
- **Issues**: Check GitHub issues or contact support

## License

MIT License - See LICENSE.md for details

## Changelog

### v1.0.0 (Current Release)
- ✅ Full travel management platform
- ✅ 5 complete role-based dashboards
- ✅ Authentication & authorization
- ✅ Travel packages & booking system
- ✅ Blog & content management
- ✅ Analytics & reporting
- ✅ Notifications system
- ✅ ESG tracking
- ✅ Multilingual support
- ✅ Production deployment ready

---

**Ready to deploy!** Follow SETUP_GUIDE.md for first-time setup and DEPLOYMENT.md for production deployment.
