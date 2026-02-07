const fs = require('fs')
const path = require('path')
// Load .env first (canonical), then .local.env (local overrides)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })
const { Client } = require('pg')

const sqlDir = path.resolve(__dirname)
const CONNECTION_TIMEOUT_MS = 10000
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 2000

// Order: base tables first (001, service_requests), then supabase/migrations, then other scripts, then seed.
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

function maskConnectionString(url) {
  try {
    const u = new URL(url)
    if (u.password) u.password = '***'
    return u.toString().replace(/:[^:@]*@/, ':***@')
  } catch {
    return '(invalid URL)'
  }
}

function getSslConfig(connectionString) {
  if (connectionString.includes('sslmode=require')) return { rejectUnauthorized: false }
  if (connectionString.includes('supabase.co') || connectionString.includes('pooler.supabase.com')) {
    return { rejectUnauthorized: false }
  }
  return undefined
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function listMigrationsOnly() {
  console.log('[v0] Migration order (dry run). No database connection.')
  console.log('[v0] Base scripts:')
  baseScripts.forEach((f) => {
    const p = path.join(sqlDir, f)
    console.log('  - ' + (fs.existsSync(p) ? f : f + ' (missing)'))
  })
  console.log('[v0] supabase/migrations:')
  if (fs.existsSync(migrationDir)) {
    fs.readdirSync(migrationDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()
      .forEach((f) => console.log('  - ' + f))
  }
  console.log('[v0] Other scripts:')
  otherScripts.forEach((f) => {
    const p = path.join(sqlDir, f)
    console.log('  - ' + (fs.existsSync(p) ? f : f + ' (missing)'))
  })
  if (fs.existsSync(supabaseSeed)) {
    console.log('[v0] Seed: supabase/seed.sql')
  }
  console.log('[v0] Total files to execute: ' + files.length)
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  const isDryRun = process.argv.includes('--dry-run')

  if (isDryRun) {
    listMigrationsOnly()
    return
  }

  if (!databaseUrl) {
    console.error('[v0] DATABASE_URL (or SUPABASE_DB_URL) not set.')
    console.error('    Add it to .env or .local.env.')
    console.error('    For Supabase use Session pooler URI: Dashboard → Connect → Session.')
    console.error('    See MIGRATE_AND_SEED.md and run: npm run db:diagnose')
    process.exit(1)
  }

  const host = (() => {
    try {
      return new URL(databaseUrl).hostname
    } catch {
      return 'unknown'
    }
  })()
  const port = (() => {
    try {
      return new URL(databaseUrl).port || '5432'
    } catch {
      return '5432'
    }
  })()

  console.log('[v0] Pre-connection: host=' + host + ', port=' + port + ', masked URL=' + maskConnectionString(databaseUrl))

  const sslConfig = getSslConfig(databaseUrl)
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    ssl: sslConfig,
  })

  let lastError = null
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      await client.connect()
      console.log('[v0] Connected to database (attempt ' + attempt + ')')
      lastError = null
      break
    } catch (connectErr) {
      lastError = connectErr
      const err = connectErr
      const msg = err.message || String(err)
      const isEnofound = msg.includes('ENOTFOUND') || (err.code === 'ENOTFOUND')
      const isTimeout = msg.includes('ETIMEDOUT') || msg.includes('timeout') || err.code === 'ETIMEDOUT'

      if (isEnofound) {
        console.error('[v0] Connection failed: getaddrinfo ENOTFOUND — hostname could not be resolved.')
        console.error('[v0] Supabase direct connection (db.XXX.supabase.co) is IPv6-only. Use Session pooler instead.')
        console.error('[v0] Fix: Supabase Dashboard → Connect → Session → copy URI → set DATABASE_URL in .env')
        console.error('[v0] Then run: npm run db:diagnose')
        console.error('[v0] See: https://supabase.com/dashboard/project/_/settings/database')
        client.end().catch(() => {})
        process.exit(1)
      }

      if (isTimeout && attempt <= MAX_RETRIES) {
        console.warn('[v0] Connection timeout (attempt ' + attempt + '). Retrying in ' + RETRY_DELAY_MS / 1000 + 's...')
        await sleep(RETRY_DELAY_MS)
        continue
      }

      if (attempt === MAX_RETRIES + 1) {
        console.error('[v0] Fatal error applying SQL:', msg)
        if (isTimeout) {
          console.error('[v0] Cannot reach the database host. Run from your machine; check firewall/VPN; or use Session pooler.')
          console.error('[v0] Run: npm run db:diagnose')
        }
        client.end().catch(() => {})
        process.exit(1)
      }
    }
  }

  if (lastError) {
    console.error('[v0] Fatal error:', lastError.message || lastError)
    client.end().catch(() => {})
    process.exit(1)
  }

  try {
    for (const filePath of files) {
      if (!fs.existsSync(filePath)) {
        console.warn('[v0] SQL file not found: ' + filePath + ', skipping')
        continue
      }
      console.log('[v0] Executing: ' + path.basename(filePath))
      const sql = fs.readFileSync(filePath, 'utf8')
      try {
        await client.query(sql)
        console.log('[v0] Successfully executed: ' + path.basename(filePath))
      } catch (err) {
        console.error('[v0] Error executing ' + path.basename(filePath) + ':', err.message || err)
        // Continue to next file; many scripts use IF NOT EXISTS guards
      }
    }
    console.log('[v0] SQL apply completed')
  } catch (err) {
    const msg = err.message || err
    console.error('[v0] Fatal error applying SQL:', msg)
    if (msg.includes('ETIMEDOUT') || msg.includes('ENOTFOUND')) {
      console.error('[v0] Cannot reach the database host. Run: npm run db:diagnose')
      console.error('[v0] Use Session pooler URI from Supabase Dashboard → Connect → Session.')
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
