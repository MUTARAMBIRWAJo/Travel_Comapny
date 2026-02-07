#!/usr/bin/env node
/**
 * Database connection diagnostic script.
 * Run: npm run db:diagnose
 *
 * Checks: env vars, DNS resolution (IPv4/IPv6), TCP connectivity, and pg connection.
 * Use this when you see getaddrinfo ENOTFOUND or ETIMEDOUT with Supabase.
 */

const dns = require('dns').promises
const net = require('net')
const path = require('path')
const { Client } = require('pg')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })

const timeout = 8000

function maskUrl(url) {
  try {
    const u = new URL(url)
    const pass = u.password ? '***' : ''
    u.password = pass
    if (u.username && u.username !== 'postgres') u.username = '***'
    return u.toString().replace(/:[^@]*@/, pass ? ':***@' : '@')
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
      if (!done) {
        done = true
        reject(err)
      }
    })
    s.once('timeout', () => {
      if (!done) {
        done = true
        s.destroy()
        reject(new Error('Connection timeout'))
      }
    })
    s.connect(Number(port), host, () => {
      if (!done) {
        done = true
        s.end()
        resolve(true)
      }
    })
  })
}

async function main() {
  console.log('=== Database connection diagnostic ===\n')

  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  if (!databaseUrl) {
    console.error('FAIL: DATABASE_URL (or SUPABASE_DB_URL) is not set.')
    console.error('  Set it in .env or .local.env. Load order: .env first, then .local.env.')
    process.exit(1)
  }

  let parsed
  try {
    parsed = new URL(databaseUrl)
  } catch (e) {
    console.error('FAIL: DATABASE_URL is not a valid URL:', e.message)
    process.exit(1)
  }

  const host = parsed.hostname
  const port = parsed.port || '5432'

  console.log('1. Environment')
  console.log('   DATABASE_URL set: yes')
  console.log('   Masked URL:', maskUrl(databaseUrl))
  console.log('   Host:', host)
  console.log('   Port:', port)
  console.log('   SSL implied (supabase.co/pooler):', /supabase\.co|pooler\.supabase\.com/.test(host))
  console.log('')

  console.log('2. DNS resolution')
  try {
    const lookup4 = dns.lookup(host, { family: 4 }).catch(() => null)
    const lookup6 = dns.lookup(host, { family: 6 }).catch(() => null)
    const [addr4, addr6] = await Promise.all([lookup4, lookup6])
    if (addr4) console.log('   IPv4:', addr4.address)
    else console.log('   IPv4: (failed or no A record)')
    if (addr6) console.log('   IPv6:', addr6.address)
    else console.log('   IPv6: (failed or no AAAA record)')
    if (!addr4 && !addr6) {
      console.error('   FAIL: No IP address found for host. This often means:')
      console.error('   - Typo in hostname (e.g. wrong project ref in db.XXX.supabase.co)')
      console.error('   - Supabase direct connection uses IPv6 by default; your network may not resolve it.')
      console.error('   FIX: Use the Session pooler URI from Supabase Dashboard → Connect → Session mode.')
      console.error('   It uses host aws-0-<region>.pooler.supabase.com and supports IPv4.')
    }
  } catch (e) {
    console.error('   FAIL:', e.message)
    if (e.code === 'ENOTFOUND') {
      console.error('   ENOTFOUND = DNS could not resolve the hostname.')
      console.error('   - Check the host in your DATABASE_URL matches Supabase Dashboard.')
      console.error('   - For direct connection (db.XXX.supabase.co), try Session pooler instead (pooler.supabase.com).')
    }
  }
  console.log('')

  console.log('3. TCP connection to ' + host + ':' + port)
  try {
    await tcpConnect(host, port)
    console.log('   OK: TCP connection succeeded.')
  } catch (e) {
    console.error('   FAIL:', e.message)
    if (e.code === 'ENOTFOUND') {
      console.error('   Fix: Use Session pooler connection string (IPv4-friendly).')
    } else if (e.code === 'ETIMEDOUT' || e.message.includes('timeout')) {
      console.error('   Fix: Check firewall/VPN; ensure port', port, 'is allowed outbound.')
    }
  }
  console.log('')

  console.log('4. PostgreSQL connection (with SSL for Supabase)')
  const useSsl = /supabase\.co|pooler\.supabase\.com/.test(host)
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: timeout,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  })
  try {
    await client.connect()
    const res = await client.query('SELECT current_database(), current_user')
    console.log('   OK: Connected to database:', res.rows[0].current_database, 'as', res.rows[0].current_user)
    await client.end()
  } catch (e) {
    console.error('   FAIL:', e.message)
    if (e.code === 'ENOTFOUND') {
      console.error('')
      console.error('   >>> Use the SESSION POOLER URI to fix ENOTFOUND <<<')
      console.error('   1. Open Supabase Dashboard → your project.')
      console.error('   2. Click "Connect" → under "Connection string" choose "Session" (or "URI").')
      console.error('   3. Copy the URI; it should look like:')
      console.error('      postgres://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres')
      console.error('   4. Put it in .env as DATABASE_URL=... (replace PASSWORD with your DB password).')
    }
    process.exitCode = 1
  }
  console.log('')
  console.log('=== End diagnostic ===')
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
