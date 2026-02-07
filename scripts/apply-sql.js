const fs = require('fs')
const path = require('path')
// Load .env first (canonical), then .local.env (local overrides)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })
const { Client } = require('pg')

const sqlDir = path.resolve(__dirname)

// Order: base tables first (001, service_requests), then supabase/migrations, then other scripts, then seed.
// This ensures travel_requests and service_requests exist before Phase 6 migration (workflow_events + ALTER).
const migrationDir = path.resolve(__dirname, '..', 'supabase', 'migrations')
const baseScripts = [
      '001-init-database.sql',
      'add-service-requests-documents.sql',
]
const otherScripts = [
      'add-audit-logs.sql',
      'add-approval-columns.sql',
      'add-payments.sql',
      'add-messaging-system.sql',
      'setup-packages-table.sql',
      'fix-packages-columns.sql',
      'fix-schema-packages.sql',
      '002-seed-sample-data.sql',
]

let files = []
for (const f of baseScripts) {
      const filePath = path.join(sqlDir, f)
      if (fs.existsSync(filePath)) files.push(filePath)
}

if (fs.existsSync(migrationDir)) {
      files = files.concat(
            fs.readdirSync(migrationDir)
                  .filter((f) => f.endsWith('.sql'))
                  .sort()
                  .map((f) => path.join(migrationDir, f))
      )
}

for (const f of otherScripts) {
      const filePath = path.join(sqlDir, f)
      if (fs.existsSync(filePath)) files.push(filePath)
}

const supabaseSeed = path.resolve(__dirname, '..', 'supabase', 'seed.sql')
if (fs.existsSync(supabaseSeed)) files.push(supabaseSeed)

async function run() {
      const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
      if (!databaseUrl) {
            console.error('[v0] DATABASE_URL (or SUPABASE_DB_URL) not set.')
            console.error('    Add it to .env or .local.env. For Supabase: Project Settings → Database → Connection string (URI).')
            process.exit(1)
      }

      const useSsl = databaseUrl.includes('sslmode=require') || databaseUrl.includes('supabase.co') || databaseUrl.includes('pooler.supabase.com')
      const client = new Client({
            connectionString: databaseUrl,
            connectionTimeoutMillis: 15000,
            ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      })
      try {
            await client.connect()
            console.log('[v0] Connected to database')

            for (const filePath of files) {
                  if (!fs.existsSync(filePath)) {
                        console.warn(`[v0] SQL file not found: ${filePath}, skipping`)
                        continue
                  }

                  console.log(`[v0] Executing: ${path.basename(filePath)}`)
                  const sql = fs.readFileSync(filePath, 'utf8')

                  // Postgres client can only accept single commands; split on semicolons conservatively
                  // We'll run the whole file as a single query, but if it's too big we'll split by \n;\n
                  try {
                        await client.query(sql)
                        console.log(`[v0] Successfully executed: ${path.basename(filePath)}`)
                  } catch (err) {
                        console.error(`[v0] Error executing ${path.basename(filePath)}:`)
                        console.error(err.message || err)
                        // Continue to next file; many scripts use IF NOT EXISTS guards
                  }
            }

            console.log('[v0] SQL apply completed')
      } catch (err) {
            const msg = err.message || err
            console.error('[v0] Fatal error applying SQL:', msg)
            if (msg.includes('ETIMEDOUT') || msg.includes('ENOTFOUND')) {
                  console.error('[v0] Cannot reach the database host. Run this script from your machine (e.g. npm run db:apply-sql) where the DB is reachable.')
            }
            process.exit(1)
      } finally {
            await client.end()
      }
}

run()
