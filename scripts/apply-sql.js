const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })
const { Client } = require('pg')

const sqlDir = path.resolve(__dirname)
const files = [
      '001-init-database.sql',
      'add-messaging-system.sql',
      'setup-packages-table.sql',
      'add-service-requests-documents.sql',
      'fix-packages-columns.sql',
      'fix-schema-packages.sql',
      '002-seed-sample-data.sql'
].map((f) => path.join(sqlDir, f))

async function run() {
      const databaseUrl = process.env.DATABASE_URL
      if (!databaseUrl) {
            console.error('[v0] DATABASE_URL not set in environment (.local.env expected)')
            process.exit(1)
      }

      const client = new Client({ connectionString: databaseUrl })
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
            console.error('[v0] Fatal error applying SQL:', err.message || err)
            process.exit(1)
      } finally {
            await client.end()
      }
}

run()
