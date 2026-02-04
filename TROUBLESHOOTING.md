# Troubleshooting Guide

## Issue: "Invalid JSON" or "Could not find column" errors

### ✅ Solution
This is **NORMAL** when CMS tables don't exist yet. The app uses fallback data.

**What to do**:
1. Check browser console - look for `[v0]` messages
2. If you see: `[v0] CMS tables not initialized` → This is expected
3. Run: `npm run seed:cms` to populate the database
4. Refresh the page

---

## Issue: Home page shows default content instead of CMS content

### Root Causes
1. CMS tables not created
2. No seed data inserted
3. Supabase connection issues

### ✅ Fix Steps

**Step 1: Verify Tables**
- Go to Supabase Dashboard
- Click "Table Editor"
- Look for tables starting with "cms_"
- If missing, see "Database Setup" section

**Step 2: Check Environment Variables**
```bash
# In your .env.local or Vercel environment
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

**Step 3: Seed Data**
```bash
npm run seed:cms
```

**Step 4: Hard Refresh Browser**
- Press `Ctrl+Shift+R` (or Cmd+Shift+R on Mac)
- Or open DevTools → Application → Clear Storage

---

## Issue: Currency Converter not showing

### Causes
- CurrencyConverter component not imported
- Styling issues

### ✅ Fix
Check `/app/page.tsx` line 7:
```tsx
import { CurrencyConverter } from "@/components/CurrencyConverter"
```

And verify it's used in the page:
```tsx
<section className="py-20 md:py-28 bg-muted/30">
  <CurrencyConverter />
</section>
```

---

## Issue: Prices not displaying correctly

### Check
1. PriceDisplay component installed
2. Package data has `price_usd` and `price_rwf` fields

### ✅ Verify Package Data
```sql
-- In Supabase SQL
SELECT id, title_en, price_usd, price_rwf 
FROM cms_packages 
WHERE status = 'active' 
LIMIT 1;
```

Expected result:
```
id  | title_en      | price_usd | price_rwf
----|---------------|-----------|----------
1   | Dubai Holiday | 2500      | 3250000
```

---

## Issue: Services not loading

### Check These
1. cms_services table exists
2. At least one service with status='active'
3. No database permission errors

### ✅ Debug Steps
```bash
# Check for errors in console
tail -f /app/logs  # if available

# Or look in browser DevTools
# Console tab should show [v0] messages
```

### ✅ Manual Check
```sql
-- In Supabase SQL
SELECT COUNT(*) FROM cms_services WHERE status = 'active';
```

Should return: `> 0`

---

## Issue: Testimonials not showing

### ✅ Fix
1. Check testimonials are inserted:
```sql
SELECT COUNT(*) FROM cms_testimonials 
WHERE status = 'active' AND is_featured = true;
```

2. Should return `> 0`

3. If 0, insert sample:
```sql
INSERT INTO cms_testimonials 
(customer_name, customer_location, message_en, is_featured, status)
VALUES 
('Jean Paul M.', 'Kigali', 'Great service!', true, 'active');
```

---

## Issue: 404 Errors on pages

### Causes
- Routes not created
- Component imports missing

### ✅ Check File Exists
```bash
# These should exist:
- /app/page.tsx ✓
- /components/Navbar.tsx ✓
- /components/Footer.tsx ✓
- /components/CurrencyConverter.tsx ✓
- /components/PriceDisplay.tsx ✓
```

---

## Issue: Mobile not responsive

### ✅ Check
1. Tailwind classes using `md:` and `lg:` prefixes
2. No hardcoded widths
3. Flex layout used

Example:
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## Issue: Currency amounts wrong

### ✅ Verify Exchange Rates
In `/lib/supabaseClient.ts`:
```typescript
export const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1,
  'RWF': 1300,  // 1 USD = 1300 RWF
  'EUR': 0.95,  // 1 USD = 0.95 EUR
  'GBP': 0.85,  // etc...
}
```

To update rates:
1. Edit EXCHANGE_RATES object
2. Save file
3. Run `npm run dev`
4. Refresh browser

---

## Issue: Supabase connection timeout

### Causes
- Network issue
- Invalid credentials
- Project suspended

### ✅ Check
1. Test connection:
```bash
# In browser console
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

2. Should show: `https://xxx.supabase.co`

3. Verify in Supabase Dashboard:
   - Settings → API
   - Copy URL and key
   - Update .env.local

---

## Issue: Prisma errors (if you see them)

### ✅ Fix
Prisma has been removed. Make sure `package.json` doesn't have:
```json
"@prisma/client": "..."
```

If it does, remove and run:
```bash
npm install
```

---

## Quick Debug Checklist

- [ ] Browser console shows `[v0]` messages (good sign)
- [ ] No 500 errors in server logs
- [ ] Supabase tables exist in dashboard
- [ ] Environment variables set correctly
- [ ] npm run dev completes without errors
- [ ] Home page loads
- [ ] Services section visible
- [ ] Currency converter appears
- [ ] Prices display
- [ ] No red errors in console

---

## Getting Help

If issues persist:

1. **Check Logs**
   - Browser Console (F12)
   - Terminal where you ran `npm run dev`
   - Supabase Logs (Dashboard → Logs)

2. **Search for Messages Starting with `[v0]`**
   - These are debug messages
   - They tell you exactly what's happening

3. **Verify Setup**
   - Follow `/DEBUG_AND_ENHANCEMENTS.md`
   - Run each step in order
   - Don't skip database setup

4. **Test Supabase Connection**
   - Supabase Dashboard
   - SQL Editor
   - Run: `SELECT NOW();`
   - Should return current timestamp

---

## Common Success Signs

✅ You'll see messages like:
```
[v0] CMS tables not initialized, using default settings
[v0] CMS services not available, using defaults
```

These mean:
- App is working normally
- Using fallback data (because DB not set up)
- Once you seed the database, these go away

✅ Page loads with:
- Hero section visible
- 4 Services displayed
- 2-3 Packages with prices
- 2 Testimonials
- Currency converter working
- All buttons functional

---

**Remember**: The fallback system is working correctly! Just follow the setup steps to activate the full CMS.
