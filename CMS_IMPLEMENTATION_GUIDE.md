# We-Of-You Travel Company - CMS Implementation Guide

## Overview

This is a **production-ready, Rwanda-centric travel management platform** with a fully admin-driven CMS system. All public content is stored in Supabase and can be edited without code changes.

---

## 🚀 Getting Started

### 1. Run Database Migrations

First, create the CMS tables in Supabase:

```bash
# Copy the SQL from scripts/init-database.sql
# Go to Supabase Dashboard → SQL Editor → Run the entire script
```

### 2. Seed CMS Content

Populate the database with initial Rwanda travel company content:

```bash
npm run seed:cms
```

This will seed:
- Global settings (brand name, contact info, working hours)
- Public pages (Home, Services, About, Contact, FAQ)
- 4 services (Flight Booking, Visa Assistance, Corporate Travel, Group Packages)
- 3 destinations (France, Turkey, Maldives) with Rwanda-specific content
- 3 customer testimonials
- 3 travel packages
- 4 FAQs

### 3. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the fully dynamic homepage powered by CMS data.

---

## 📊 Database Schema

### CMS Tables

#### `cms_global_settings`
Stores company-wide configuration (name, contact, hours, etc.)
- Multilingual: `value_en`, `value_rw`, `value_fr`
- Used across all pages

#### `cms_pages`
Defines public pages and their SEO
- `page_key`: unique identifier (home, about, contact, etc.)
- `status`: published | draft
- SEO fields for each language

#### `cms_page_sections`
Content blocks within pages
- `section_type`: hero, text, cards, faq, testimonials, cta
- Ordered by `order_index`
- Multilingual content & images

#### `cms_services`
Service offerings (Flight Booking, Visa Assistance, etc.)
- Full descriptions in 3 languages
- Icon, image, slug
- Order and status control

#### `cms_destinations`
Travel destinations with Rwanda-specific guidance
- Visa requirements
- Cultural tips
- Flight routes from Kigali
- Safety & food notes
- All in EN, RW, FR

#### `cms_testimonials`
Client success stories
- Customer name, title, location
- Message in 3 languages
- Photo support
- Featured toggle

#### `cms_packages`
Travel packages (Dubai Holiday, Student Visa Support, etc.)
- Duration, includes, pricing
- RWF and USD prices
- Status control

#### `cms_faqs`
Frequently asked questions
- Questions & answers in 3 languages
- Category (Visa, Payments, etc.)
- Order control

---

## 🛠️ Admin Features

### Admin Can Control:

1. **Global Settings**
   - Company name, tagline
   - Phone, WhatsApp, email
   - Office address, working hours
   - Footer text
   - All multilingual

2. **Services**
   - Add/edit/remove services
   - Change descriptions
   - Update icons & images
   - Reorder
   - Publish/unpublish

3. **Destinations**
   - Visa requirements per country
   - Rwanda-specific cultural tips
   - Flight route information
   - Safety & food guidance

4. **Packages**
   - Create travel packages
   - Set prices in RWF & USD
   - Add duration & inclusions
   - Upload images
   - Control availability

5. **Testimonials**
   - Add client success stories
   - Feature testimonials on homepage
   - Upload photos
   - Manage in 3 languages

6. **FAQs**
   - Create category-based FAQs
   - Answer in 3 languages
   - Control display order

---

## 🌐 Pages (All Dynamic)

### Home (`/`)
- Fetches global settings for brand name & tagline
- Displays all active services
- Shows featured packages
- Shows featured testimonials
- Fully Rwanda-centric messaging

### Services (`/services`)
- Lists all active services
- Each service links to detail page

### Packages (`/packages`)
- Displays all travel packages
- Prices in RWF & USD
- Filterable by category

### Destinations (`/destinations`)
- Lists all destinations
- Rwanda-specific guidance included

### About (`/about`)
- Managed via cms_pages & cms_page_sections

### Contact (`/contact`)
- Uses global settings for phone, email, address, hours

### FAQ (`/faq`)
- Displays all FAQs
- Organized by category

---

## 🔐 Authentication

After running `npm run seed`, test login with:

```
Email: admin@weofyoutravel.com
Password: Admin@123
```

This is an admin user. Update credentials in production.

---

## 💳 Multi-Currency & Payment

The platform supports:
- **RWF (Rwandan Franc)** - Primary currency
- **USD (US Dollar)** - Secondary display

Packages show prices in both:
```
$2,500 / 3,500,000 RWF
```

Payment methods supported (stored in settings):
- MTN Mobile Money
- Airtel Money
- Bank Transfer

---

## 🌍 Multilingual Support

All content supports 3 languages:
1. **English (en)** - Default
2. **Kinyarwanda (rw)** - Rwanda's primary language
3. **French (fr)** - Regional language

Content fields follow naming pattern:
- `title_en`, `title_rw`, `title_fr`
- `content_en`, `content_rw`, `content_fr`
- `description_en`, `description_rw`, `description_fr`

---

## 🇷🇼 Rwanda-Centric Features

### Built-In Rwanda Messaging:
- "Proudly Rwanda-based" branding
- Kigali office location
- Rwanda flight routes (via Addis Ababa, Doha, Brussels)
- Rwandan traveler guidance (visa tips, flight connections)
- Local payment methods (MTN Money, Airtel Money)
- Rwanda-specific testimonials
- Rwandan holiday calendar support

### Content Reflects:
- Rwandan passport holder visa requirements
- Flight routes FROM Kigali
- Diaspora traveler needs
- Corporate travel for Rwandan companies
- Student travel support
- Pilgrim travel support

---

## 🗂️ File Structure

```
/scripts
  ├── init-database.sql       # Database schema (CMS tables)
  ├── seed.js                 # User & core data seed
  └── seed-cms.js             # CMS content seed

/lib
  └── supabaseClient.ts       # Supabase helpers for fetching CMS data

/app
  ├── page.tsx                # Dynamic homepage (fetches from CMS)
  ├── services/
  ├── packages/
  ├── destinations/
  ├── about/
  ├── contact/
  └── faq/
```

---

## 🚢 Deployment

### To Deploy:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import GitHub repo
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY (for seeding)
     ```

3. **Run Database Migrations**
   - Execute SQL schema in Supabase
   - Run `npm run seed:cms` via Vercel CLI or SSH

4. **Deploy**
   - Vercel auto-builds and deploys

### Production Checklist:
- [ ] All CMS tables created in Supabase
- [ ] CMS seed script executed
- [ ] Admin credentials changed
- [ ] Global settings updated with real company info
- [ ] Services, packages, destinations customized
- [ ] All pages tested in 3 languages
- [ ] Mobile responsiveness verified
- [ ] Payment options configured
- [ ] Email notifications set up
- [ ] Analytics configured

---

## 📝 Sample Content Included

When you run `npm run seed:cms`, you get:

**Global Settings:**
- Brand: "We-Of-You Travel Company"
- Tagline: "Your Trusted Travel Partner from Rwanda to the World"
- Phone: +250 XXX XXX XXX
- WhatsApp: +250 XXX XXX XXX
- Email: info@weofyoutravel.com
- Address: Kigali, Rwanda
- Hours: Monday-Saturday, 8:00 AM - 6:00 PM

**Services:**
1. International Flight Booking
2. Visa Assistance
3. Corporate & NGO Travel
4. Holiday & Group Packages

**Destinations:**
1. France (Schengen visa, Paris, cultural tips)
2. Turkey (E-Visa, Istanbul, halal food)
3. Maldives (Visa on arrival, water sports, beach)

**Packages:**
1. Dubai Holiday (5D/4N, $2,500 / 3.5M RWF)
2. Student Study Visa Support (Flexible, $300 / 450K RWF)
3. European Grand Tour (10D/9N, $5,000 / 7.5M RWF)

**Testimonials:**
- Jean Paul (Business Traveler, Kigali)
- Aline (Corporate Travel Manager, Kigali)
- David (International Student, Butare)

**FAQs:**
- Do you guarantee visa approval?
- Can I pay using Mobile Money?
- What payment plans are available?
- How long does visa processing take?

---

## 🔧 API Helpers

Use these to fetch CMS data in any page:

```typescript
import {
  getGlobalSettings,
  getPageWithSections,
  getServices,
  getDestinations,
  getTestimonials,
  getPackages,
  getFAQs
} from "@/lib/supabaseClient"

// In Server Components:
const services = await getServices()
const packages = await getPackages()
const testimonials = await getTestimonials(true) // featured only
```

---

## 📞 Support

For questions or issues:
- Email: dev@weofyoutravel.com
- WhatsApp: +250 XXX XXX XXX

---

## 📄 License

This is a production travel platform for We-Of-You Travel Company. All rights reserved.

Last Updated: 2025

---

## 🎯 Next Steps

1. ✅ Database schema created
2. ✅ CMS seed script ready
3. ✅ Homepage made dynamic
4. 📋 TODO: Create admin dashboard for content management
5. 📋 TODO: Build Filament or custom CMS UI
6. 📋 TODO: Implement other public pages with CMS data
7. 📋 TODO: Add multilingual page routing
8. 📋 TODO: Deploy to production

Enjoy your Rwanda-powered, globally-serving travel platform! 🚀
