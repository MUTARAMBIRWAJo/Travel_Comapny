const dns = require('dns').promises
const net = require('net')
const { Client } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })

async function tcpCheck(host, port, timeout = 5000) {
      return new Promise((resolve, reject) => {
            const s = new net.Socket()
            let called = false
            s.setTimeout(timeout)
            s.once('error', (err) => {
                  if (!called) {
                        called = true
                        reject(err)
                  }
            })
            s.once('timeout', () => {
                  if (!called) {
                        called = true
                        s.destroy()
                        reject(new Error('timeout'))
                  }
            })
            s.connect(port, host, () => {
                  if (!called) {
                        called = true
                        s.end()
                        resolve(true)
                  }
            })
      })
}

async function run() {
      try {
            const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
            if (!databaseUrl) {
                  console.error('[v0] DATABASE_URL (or SUPABASE_DB_URL) not found. Set in .env or .local.env.')
                  process.exit(2)
            }

            const parsed = new URL(databaseUrl)
            const host = parsed.hostname
            const port = parsed.port || '5432'

            console.log(`[v0] Host: ${host}`)
            console.log(`[v0] Port: ${port}`)

            // DNS lookup
            try {
                  const addresses = await dns.lookup(host, { all: true })
                  console.log('[v0] DNS lookup addresses:', addresses.map(a => a.address).join(', '))
            } catch (err) {
                  console.warn('[v0] DNS lookup failed:', err.message)
            }

            // TCP check
            try {
                  await tcpCheck(host, Number(port), 5000)
                  console.log('[v0] TCP connection to host:port succeeded')
            } catch (err) {
                  console.warn('[v0] TCP connection to host:port failed:', err.message)
            }

            // Try actual DB connection with pg (SSL for Supabase/pooler)
            const useSsl = databaseUrl.includes('supabase.co') || databaseUrl.includes('pooler.supabase.com')
            try {
                  const client = new Client({
                        connectionString: databaseUrl,
                        connectionTimeoutMillis: 10000,
                        statement_timeout: 5000,
                        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
                  })
                  await client.connect()
                  const res = await client.query('SELECT 1')
                  console.log('[v0] Database connection test succeeded:', res.rows)
                  await client.end()
                  process.exit(0)
            } catch (err) {
                  console.error('[v0] Database connection failed:', err.message)
                  process.exit(3)
            }
      } catch (err) {
            console.error('[v0] Unexpected error in db-check:', err)
            process.exit(4)
      }
}

run()
