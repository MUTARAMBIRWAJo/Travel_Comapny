# We-Of-You Travel Platform - Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database initialized and seeded
- [ ] Prisma client generated
- [ ] All tests passing
- [ ] Production build successful
- [ ] Security review completed

## Environment Variables

Required environment variables:

```
DATABASE_URL=postgresql://user:password@host/database
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Optional:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

### Option 1: Neon PostgreSQL (Recommended)

1. Create a Neon account at https://neon.tech
2. Create a new project and database
3. Copy the connection string to `DATABASE_URL`
4. Run the SQL schema from `scripts/init-database.sql`
5. Seed data: `npm run seed`

### Option 2: Supabase

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings → Database → Connection String
3. Copy the connection string (select "Transaction" pooler)
4. Set as `DATABASE_URL`
5. Run SQL schema and seed data

### Option 3: Self-Hosted PostgreSQL

1. Create a PostgreSQL database
2. Set connection string: `postgresql://user:password@host:5432/database`
3. Run SQL schema: Import `scripts/init-database.sql`
4. Seed data: `npm run seed`

## Deployment Platforms

### Vercel (Easiest)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project" and select your repository
4. Add environment variables in Settings → Environment Variables
5. Click "Deploy"

The app will be live at `yourdomain.vercel.app`

**Post-deployment:**
- Set custom domain in Project Settings
- Configure SSL certificate (automatic)

### AWS Amplify

1. Push code to GitHub/GitLab/CodeCommit
2. Go to AWS Amplify Console
3. Select "New app" → "Host web app"
4. Choose your git provider and repository
5. Add build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       build:
         commands:
           - npm ci
           - npm run build
   ```
6. Add environment variables
7. Deploy

### Railway

1. Go to https://railway.app
2. Create a new project
3. Select "Deploy from GitHub"
4. Choose your repository
5. Add environment variables
6. Railway auto-deploys on git push

### DigitalOcean App Platform

1. Create a DigitalOcean account
2. Go to App Platform
3. Create a new app from GitHub
4. Configure build command: `npm run build`
5. Configure run command: `npm run start`
6. Add environment variables
7. Deploy

## Production Build

```bash
# Build the application
npm run build

# Test production build locally
npm run start
```

## Monitoring & Maintenance

### Health Checks

- Monitor database connections
- Check API response times
- Monitor error logs
- Track user authentication failures

### Backups

- Enable automated database backups
- Test restore procedures monthly
- Store backups in secure location

### Security Updates

- Keep dependencies updated: `npm audit fix`
- Monitor for security vulnerabilities
- Regular security audits
- Enable 2FA on hosting platform

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### Build Failures

1. Clear cache: `npm cache clean --force`
2. Remove node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

### Authentication Issues

1. Verify DATABASE_URL is set correctly
2. Check that roles are initialized in database
3. Verify bcrypt is working: `npm test`

## Performance Optimization

### Database Optimization

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Create indexes for frequently queried fields
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_travel_requests_status ON travel_requests(status);
```

### Caching

- Enable Redis caching for frequently accessed data
- Cache API responses for 5-15 minutes
- Cache static assets indefinitely

### CDN

- Use Vercel's built-in CDN (automatic)
- Configure custom CDN if needed
- Cache images and static assets

## Scaling Considerations

### Database Scaling

- Monitor connection pool usage
- Scale read replicas as needed
- Archive old data regularly

### Application Scaling

- Monitor CPU and memory usage
- Scale horizontally as traffic increases
- Use load balancing for multiple instances

## Support

For deployment issues, contact:
- Technical Support: support@weofyou.com
- Security Issues: security@weofyou.com
