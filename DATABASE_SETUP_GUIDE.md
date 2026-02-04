# Database Setup Guide for We-Of-You Travel Company

## Current Status

The application is working perfectly with fallback default data. However, the CMS tables haven't been created in your Supabase instance yet. This guide shows you how to initialize them.

## Why You See the 404 Error

When you preview the application, Supabase queries the database for CMS tables (`cms_services`, `cms_packages`, etc.). Since these tables don't exist yet, you see this error:

```
Could not find the table 'public.cms_services' in the schema cache
```

However, **the application handles this gracefully** by using default fallback data. The page still renders perfectly - you just see the warning in the console.

## How to Fix This Permanently

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Initialize the Core Database

Copy and paste the content from `/scripts/init-database.sql` into the SQL editor and execute it.

This creates:
- `users` table
- `companies` table
- `packages` table
- `destinations` table
- And all CMS tables for dynamic content

### Step 3: Initialize Additional Systems (Optional)

After the core database is set up, you can optionally run these migrations:

1. **Service Request System**: `/scripts/add-service-requests-documents.sql`
2. **Messaging System**: `/scripts/add-messaging-system.sql`

### Step 4: Add Sample Data (Optional)

Once tables are created, you can add sample data for:
- Services
- Packages
- Destinations
- Testimonials
- FAQs

## Verification

After running the migrations, you should see:
- No more 404 errors in the console
- The application loads data from your Supabase database instead of defaults

## Database Schema Overview

### CMS Tables
- `cms_global_settings` - Site configuration (brand name, contact info, etc.)
- `cms_services` - Service offerings (Visa, Flights, Corporate Travel, etc.)
- `cms_packages` - Travel packages
- `cms_destinations` - Travel destinations
- `cms_testimonials` - Client testimonials
- `cms_faqs` - Frequently asked questions
- `cms_pages` - Page content management
- `cms_page_sections` - Page sections with dynamic content

### System Tables
- `users` - User accounts and profiles
- `companies` - Corporate accounts
- `travel_requests` - Service requests from travelers
- `service_documents` - Document storage
- `conversations` - Messaging between users
- `messages` - Individual messages
- `officer_assignments` - Officer-to-request assignments

## Current Fallback Data

The application includes excellent default data for:
- 4 Services (Visa Assistance, Flight Booking, Corporate Travel, Travel Packages)
- 2 Packages (Dubai Holiday, European Cities)
- 2 Destinations (France, Turkey)
- 2 Testimonials from verified clients
- 8 Currency conversion rates

This ensures the application works perfectly even before the database is initialized.

## Support

If you encounter any issues during setup:
1. Check that all environment variables are set correctly in the Supabase project
2. Ensure your Supabase API keys are active
3. Verify that SQL migrations ran without errors
4. Check the database schema in Supabase to confirm tables were created

## Next Steps

1. Run the database migrations in Supabase
2. The application will automatically start using live database data
3. Use the admin dashboard to manage content, currency rates, and service requests
4. Invite officers and travelers to start using the platform
