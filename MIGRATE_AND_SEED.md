# Migrate and Seed — Run locally

Migrations and seed **must run from your machine** (or any host that can reach your Supabase DB). The scripts load **`.env` first**, then `.local.env` (local overrides).

**When you see connection errors, run the diagnostic first:** `npm run db:diagnose`

### Complete workflow (summary)

1. Set **`DATABASE_URL`** in `.env` to the **Session pooler** URI (Supabase Dashboard → Connect → Session).
2. Run **`npm run db:diagnose`** — fix any issues until it reports a successful PostgreSQL connection.
3. Run **`npm run db:full`** to apply all migrations and seeds in one go.

To see which SQL files run (without connecting), use **`npm run db:dry-run`**.

---

## Why you might see `getaddrinfo ENOTFOUND db.xxx.supabase.co`

### IPv6 vs Session pooler

Supabase offers two ways to connect to Postgres:

| Mode | Host example | Typical issue |
|------|----------------|----------------|
| **Direct** | `db.XXX.supabase.co:5432` | Uses **IPv6 only**. Many home/office networks and VPNs don’t resolve or route IPv6 for this host, so you get **ENOTFOUND** or timeouts. |
| **Session pooler** | `aws-0-REGION.pooler.supabase.com:5432` | Works over **IPv4**. Use this for migrations and seeds from your machine. |

**Fix:** Use the **Session pooler** connection string instead of the Direct one. No code change required—only the value of `DATABASE_URL` in `.env`.

---

## Step 1: Get the Session pooler URI from Supabase

1. Open **[Supabase Dashboard](https://supabase.com/dashboard)** and select your project.
2. Click the **"Connect"** button (top of the page, or in the left sidebar under **Project Settings**).
3. Under **Connection string**, select **"Session"** (not "Direct" and not "Transaction" unless you prefer port 6543).
4. Copy the URI. It should look like:
   ```
   postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
   The host must be **`aws-0-<region>.pooler.supabase.com`** (not `db.xxx.supabase.co`).
5. Replace the password placeholder with your **database password** (Project Settings → [Database](https://supabase.com/dashboard/project/_/settings/database) → Database password).
6. Optional: You can use **Transaction** mode (port **6543**) instead of Session (port **5432**); both work. Session is preferred for one-off migrations.

Direct link to database settings:  
**[Connection settings](https://supabase.com/dashboard/project/_/settings/database)**

---

## Step 2: Environment file

Create or edit **`.env`** (or **`.local.env`**) in the project root:

```env
# Use the SESSION pooler URI from Step 1 (avoids ENOTFOUND)
DATABASE_URL=postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres

# Required for app and for db:seed:legal
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- Scripts use **`DATABASE_URL`** or **`SUPABASE_DB_URL`** (same value).
- Load order: **`.env`** first, then **`.local.env`** (later overrides).

See **`.env.example`** for Session vs Direct explanation and a template.

---

## Step 3: Run the diagnostic (recommended first)

Before migrating, check that the database is reachable:

```bash
npm run db:diagnose
```

This checks:

- That `DATABASE_URL` or `SUPABASE_DB_URL` is set
- DNS resolution (IPv4 and IPv6)
- TCP connectivity to the host:port
- PostgreSQL connection with SSL

If you see **ENOTFOUND**, the script will print exact steps to switch to the Session pooler URI. Fix `.env` and run `npm run db:diagnose` again until it reports a successful PostgreSQL connection.

---

## Step 4: Run migrations and seed

From the project root (PowerShell or bash):

```bash
npm run db:full
```

This runs in order:

1. **db:apply-sql** — Applies all SQL (base scripts, `supabase/migrations/*.sql`, other scripts, `supabase/seed.sql`).
2. **db:seed** — Roles, users, companies, travel packages.
3. **db:seed:cms** — CMS and site settings.
4. **db:seed:legal** — Seven legal pages (requires Supabase URL + service role key).

Or run step by step:

```bash
npm run db:apply-sql
npm run db:seed
npm run db:seed:cms
npm run db:seed:legal
```

Optional quick connectivity check (no SQL):

```bash
npm run db:check
```

---

## Step 5: Commands reference

| Command | Description |
|--------|-------------|
| `npm run db:diagnose` | **Run this first** when you have connection issues. Full diagnostic (env, DNS, TCP, Postgres). |
| `npm run db:dry-run` | List migration order and file count; no DB connection. |
| `npm run db:check` | Quick DB connectivity test. |
| `npm run db:apply-sql` | Migrations only. |
| `npm run db:seed` | Data seed only (run after migrate). |
| `npm run db:seed:cms` | CMS seed only. |
| `npm run db:seed:legal` | Legal pages only (needs Supabase env). |
| `npm run db:full` | Apply SQL + all seeds. |
| `npm run migrate-and-seed` | Apply SQL + seed + cms (no legal). |

---

## Troubleshooting

### Run the diagnostic first

```bash
npm run db:diagnose
```

Use its output to see where the connection fails (env, DNS, TCP, or Postgres).

### `getaddrinfo ENOTFOUND db.xxx.supabase.co`

- **Cause:** You are using the **Direct** connection (IPv6-only). Your network or DNS doesn’t resolve that host.
- **Fix:**
  1. Supabase Dashboard → **Connect** → choose **Session** (not Direct).
  2. Copy the URI (host: `aws-0-<region>.pooler.supabase.com`).
  3. Set `DATABASE_URL=` that URI in `.env` (replace the password).
  4. Run `npm run db:diagnose` again.

### `ETIMEDOUT` or connection timeout

- **Cause:** Cannot reach the host (firewall, VPN, or wrong host/port).
- **Fix:** Run from a network that allows outbound port **5432** (or **6543** for Transaction mode). Try the Session pooler if you were using Direct. Run `npm run db:diagnose`.

### Wrong password / authentication failed

- Use the **database password** from Project Settings → [Database](https://supabase.com/dashboard/project/_/settings/database) (reset if needed).
- No spaces in the URI; if the password contains `@`, `#`, `?`, or `%`, URL-encode it.

### URI format

- Use a single line, no line breaks.
- Scheme: `postgresql://` or `postgres://`.
- Example: `postgresql://postgres.abcdefgh:MyP%40ss@aws-0-us-east-1.pooler.supabase.com:5432/postgres` (password `MyP@ss` encoded).

### Env load order

- Scripts load **`.env`** first, then **`.local.env`**. The last value wins for each variable. Ensure the correct `DATABASE_URL` is in the file you intend to use (or remove the other).

### Connection configuration (for reference)

- **SSL:** Scripts enable SSL (`rejectUnauthorized: false`) when the host contains `supabase.co` or `pooler.supabase.com`.
- **Timeout:** Connection timeout is 10 seconds; the migration script retries up to 2 times on timeout.
- **Session pooler:** Recommended for migrations and seeds. Direct is IPv6-only and often fails from local machines.
