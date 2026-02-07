# Migrate and Seed — Run locally

Migrations and seed **must run from your machine** (or any host that can reach your Supabase DB). The scripts load **`.env` first**, then `.local.env` (local overrides). Use the **Supabase connection string** in `.env` so the database is reachable.

---

## 1. Get your Supabase database URL

**Important:** Supabase’s **direct** connection (`db.XXX.supabase.co:5432`) uses **IPv6 only**. Many local networks don’t resolve or support it, which causes **`getaddrinfo ENOTFOUND db.xxx.supabase.co`**. Use the **Session pooler** URI instead (IPv4-friendly).

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Click **Connect** (or Project Settings → **Database**).
3. Under **Connection string**, choose **Session** (or **URI** with Session mode).
4. Copy the URI. It should look like:
   ```
   postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
   ```
   Host will be `aws-0-<region>.pooler.supabase.com` (not `db.xxx.supabase.co`).
5. Replace the password placeholder with your **database password** (Project Settings → Database).
6. Session mode uses port **5432**; Transaction mode uses **6543** — both work; Session is preferred for migrations.

If you prefer a single env name, use `DATABASE_URL` or `SUPABASE_DB_URL`.

---

## 2. Environment file

Create or edit **`.env`** or **`.local.env`** in the project root:

```env
# Required for migrations and seed (use the URI from step 1)
DATABASE_URL=postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres

# Required for legal pages seed and app auth
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- **NEXT_PUBLIC_SUPABASE_URL**: Project Settings → API → Project URL.  
- **SUPABASE_SERVICE_ROLE_KEY**: Project Settings → API → `service_role` (secret).  

---

## 3. Run all migrations and seed

From the project root (PowerShell or bash):

```bash
npm run db:full
```

Or run step by step:

```bash
npm run db:apply-sql
npm run db:seed
npm run db:seed:cms
npm run db:seed:legal
```

Optional: check that the DB is reachable first:

```bash
npm run db:check
```

**db:full** runs in order:

1. **db:apply-sql** — Base tables (`001-init-database`, `add-service-requests-documents`), then `supabase/migrations/*.sql`, then other scripts and `supabase/seed.sql`.
2. **db:seed** — Roles, users, companies, travel packages.
3. **db:seed:cms** — CMS and site settings.
4. **db:seed:legal** — Seven legal pages (needs Supabase URL + service role key).

---

## 4. Run steps separately

| Command | Description |
|--------|-------------|
| `npm run db:apply-sql` | Migrations only |
| `npm run db:seed` | Data seed only (run after migrate) |
| `npm run db:seed:cms` | CMS seed only |
| `npm run db:seed:legal` | Legal pages only (needs Supabase env) |
| `npm run db:check` | Quick DB connectivity test |
| `npm run db:diagnose` | Full diagnostic (DNS, TCP, pg) for connection errors |
| `npm run migrate-and-seed` | Migrate + seed + cms (no legal) |

---

## 5. Connection troubleshooting

### Run the diagnostic

```bash
npm run db:diagnose
```

This checks: env vars, DNS (IPv4/IPv6), TCP connectivity, and Postgres connection. Use it when you see `ENOTFOUND` or `ETIMEDOUT`.

### `getaddrinfo ENOTFOUND db.xxx.supabase.co`

- **Cause:** Supabase **direct** connection uses **IPv6**. Your network or DNS may not resolve `db.XXX.supabase.co`.
- **Fix:** Use the **Session pooler** URI instead of the direct URI.
  1. Dashboard → **Connect** → choose **Session** (not Direct).
  2. Copy the URI (host will be `aws-0-<region>.pooler.supabase.com`).
  3. Set `DATABASE_URL=` that URI in `.env`.

### Other issues

- **ETIMEDOUT**: Firewall/VPN blocking outbound port 5432 (or 6543). Run from a network that allows it; or try Session pooler.
- **Wrong password**: Use the database password from Project Settings → Database (reset if needed).
- **URI format**: No spaces; if the password contains `@`, `#`, `?`, or `%`, URL-encode it.
- **Env load order**: Scripts load `.env` first, then `.local.env`. Ensure the correct `DATABASE_URL` is in the file that wins (or remove the other).
