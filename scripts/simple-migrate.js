const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })
const { Client } = require('pg')

async function runMigrations() {
      const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
      })

      try {
            console.log('🔌 Connecting to database...')
            console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')

            // Get all SQL files from migrations directory
            const migrationDir = path.resolve(__dirname, '..', 'supabase', 'migrations')
            const sqlFiles = []

            if (fs.existsSync(migrationDir)) {
                  const files = fs.readdirSync(migrationDir)
                        .filter(f => f.endsWith('.sql'))
                        .sort()
                        .map(f => path.join(migrationDir, f))
                  sqlFiles.push(...files)
            }

            // Add other SQL files
            const scriptSqlFiles = [
                  '001-init-database.sql',
                  'add-audit-logs.sql',
                  'add-approval-columns.sql',
                  'add-payments.sql',
                  'add-messaging-system.sql',
                  'setup-packages-table.sql',
                  'add-service-requests-documents.sql',
                  'fix-packages-columns.sql',
                  'fix-schema-packages.sql',
                  '002-seed-sample-data.sql'
            ]

            for (const sqlFile of scriptSqlFiles) {
                  const filePath = path.resolve(__dirname, sqlFile)
                  if (fs.existsSync(filePath)) {
                        sqlFiles.push(filePath)
                  }
            }

            console.log(`📄 Found ${sqlFiles.length} SQL files to execute`)

            // Execute each SQL file
            for (const sqlFile of sqlFiles) {
                  const fileName = path.basename(sqlFile)
                  console.log(`\n▶️  Executing ${fileName}...`)

                  try {
                        const sql = fs.readFileSync(sqlFile, 'utf8')
                        await client.query(sql)
                        console.log(`✅ ${fileName} executed successfully`)
                  } catch (error) {
                        console.log(`⚠️  ${fileName} failed: ${error.message}`)
                        // Continue with other files
                  }
            }

            console.log('\n🎉 All migrations completed!')

      } catch (error) {
            console.error('❌ Migration failed:', error.message)
            console.error('Full error:', error)
            process.exit(1)
      } finally {
            await client.end()
      }
}

runMigrations()