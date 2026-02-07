#!/usr/bin/env node
/**
 * Database connection diagnostic script.
 * Run: npm run db:diagnose
 *
 * Use this FIRST when you see getaddrinfo ENOTFOUND or ETIMEDOUT with Supabase.
 * Checks: env vars, DNS (IPv4 + IPv6), TCP connectivity, PostgreSQL connection.
 * Suggests Session pooler when ENOTFOUND is detected (direct connection is IPv6-only).
 */

const dns = require('dns').promises
const net = require('net')
const path = require('path')
const { Client } = require('pg')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })

const timeout = 10000

// ANSI colors (work in most terminals including Windows 10+)
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
}

function maskUrl(url) {
  try {
    const u = new URL(url)
    if (u.password) u.password = '***'
    if (u.username && u.username !== 'postgres') u.username = '***'
    return u.toString().replace(/:[^:@]*@/, ':***@')
  } catch {
    return '(invalid URL)'
  }
}

function tcpConnect(host, port) {
  return new Promise((resolve, reject) => {
    const s = new net.Socket()
    let done = false
    s.setTimeout(timeout)
    s.once('error', (err) => {
      if (!done) { done = true; reject(err) }
    })
    s.once('timeout', () => {
      if (!done) { done = true; s.destroy(); reject(new Error('Connection timeout')) }
    })
    s.connect(Number(port), host, () => {
      if (!done) { done = true; s.end(); resolve(true) }
    })
  })
}

function isDirectSupabase(host) {
  return /^db\.[a-z0-9]+\.supabase\.co$/i.test(host)
}

function isPoolerSupabase(host) {
  return /\.pooler\.supabase\.com$/i.test(host)
}

async function main() {
  console.log(c.bold('=== Database connection diagnostic ===\n'))

  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  if (!databaseUrl) {
    console.error(c.red('FAIL: DATABASE_URL (or SUPABASE_DB_URL) is not set.'))
    console.error('  Set it in .env or .local.env. Load order: .env first, then .local.env.')
    console.error('  See .env.example and MIGRATE_AND_SEED.md for Session pooler instructions.')
    process.exit(1)
  }

  let parsed
  try {
    parsed = new URL(databaseUrl)
  } catch (e) {
    console.error(c.red('FAIL: DATABASE_URL is not a valid URL:'), e.message)
    process.exit(1)
  }

  const host = parsed.hostname
  const port = parsed.port || '5432'
  const isDirect = isDirectSupabase(host)
  const isPooler = isPoolerSupabase(host)

  // --- 1. Environment ---
  console.log(c.bold('1. Environment variables'))
  console.log('   DATABASE_URL or SUPABASE_DB_URL:', c.green('set'))
  console.log('   Masked URL:', c.dim(maskUrl(databaseUrl)))
  console.log('   Host:', host)
  console.log('   Port:', port)
  console.log('   Connection type:', isDirect ? c.yellow('Direct (IPv6-only)') : isPooler ? c.green('Session pooler (IPv4-friendly)') : 'Other')
  if (isDirect) {
    console.log(c.yellow('   ⚠ Direct host often causes ENOTFOUND on many networks. Use Session pooler instead.'))
  }
  console.log('')

  // --- 2. DNS resolution ---
  console.log(c.bold('2. DNS resolution'))
  try {
    const lookup4 = dns.lookup(host, { family: 4 }).then(r => r).catch(() => null)
    const lookup6 = dns.lookup(host, { family: 6 }).then(r => r).catch(() => null)
    const [addr4, addr6] = await Promise.all([lookup4, lookup6])
    if (addr4) console.log('   IPv4 (A):', c.green(addr4.address))
    else console.log('   IPv4 (A):', c.red('failed or no A record'))
    if (addr6) console.log('   IPv6 (AAAA):', c.green(addr6.address))
    else console.log('   IPv6 (AAAA):', c.red('failed or no AAAA record'))
    if (!addr4 && !addr6) {
      console.error('')
      console.error(c.red('   FAIL: No IP address found for host.'))
      console.error('   Common causes:')
      console.error('   - Typo in hostname (e.g. wrong project ref in db.XXX.supabase.co)')
      console.error('   - Direct connection (db.XXX.supabase.co) is IPv6-only; your network may not resolve it.')
      console.error('')
      console.error(c.bold('   FIX: Use the Session pooler URI (see step 4 below).'))
    }
  } catch (e) {
    console.error(c.red('   FAIL:'), e.message)
    if (e.code === 'ENOTFOUND') {
      console.error('   ENOTFOUND = DNS could not resolve the hostname.')
      console.error('   For db.XXX.supabase.co, switch to Session pooler (aws-0-REGION.pooler.supabase.com).')
    }
  }
  console.log('')

  // --- 3. TCP connectivity ---
  console.log(c.bold('3. TCP connection to ' + host + ':' + port))
  try {
    await tcpConnect(host, port)
    console.log('   Result:', c.green('OK — TCP connection succeeded'))
  } catch (e) {
    console.log('   Result:', c.red('FAIL — ' + (e.message || e.code)))
    if (e.code === 'ENOTFOUND') {
      console.error(c.yellow('   Fix: Use Session pooler connection string (IPv4-friendly).'))
    } else if (e.code === 'ETIMEDOUT' || (e.message && e.message.includes('timeout'))) {
      console.error('   Fix: Check firewall/VPN; ensure port', port, 'is allowed outbound.')
    }
  }
  console.log('')

  // --- 4. PostgreSQL connection ---
  console.log(c.bold('4. PostgreSQL connection'))
  const useSsl = databaseUrl.includes('sslmode=require') || /supabase\.co|pooler\.supabase\.com/.test(host)
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: timeout,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  })
  try {
    await client.connect()
    const res = await client.query('SELECT current_database(), current_user')
    console.log('   Result:', c.green('OK — Connected'))
    console.log('   Database:', res.rows[0].current_database, '| User:', res.rows[0].current_user)
    await client.end()
  } catch (e) {
    console.log('   Result:', c.red('FAIL — ' + (e.message || e.code)))
    if (e.code === 'ENOTFOUND') {
      console.error('')
      console.error(c.bold('   >>> Use the SESSION POOLER URI to fix ENOTFOUND <<<'))
      console.error('')
      console.error('   Exact steps:')
      console.error('   1. Open Supabase Dashboard: https://supabase.com/dashboard')
      console.error('   2. Select your project')
      console.error('   3. Click the "Connect" button (top of the page)')
      console.error('   4. Under "Connection string", select "Session" (not "Direct")')
      console.error('   5. Copy the URI. Host should be: aws-0-<region>.pooler.supabase.com')
      console.error('   6. In .env set: DATABASE_URL=postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres')
      console.error('   7. Replace YOUR_DB_PASSWORD with your database password (Project Settings → Database)')
      console.error('')
      console.error('   Connection settings: https://supabase.com/dashboard/project/_/settings/database')
    }
    process.exitCode = 1
  }
  console.log('')
  console.log(c.bold('=== End diagnostic ==='))
  if (process.exitCode === 1) {
    console.error(c.yellow('Run "npm run db:diagnose" again after updating .env with the Session pooler URI.'))
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
