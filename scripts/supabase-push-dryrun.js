const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.local.env') })

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
      console.error('[v0] DATABASE_URL not found in .local.env')
      process.exit(1)
}

const cmd = `supabase db push --db-url "${dbUrl}" --dry-run --include-seed`
console.log('[v0] Running:', cmd)

const p = exec(cmd, { maxBuffer: 1024 * 1024 * 10 })

p.stdout.on('data', (d) => process.stdout.write(d))
p.stderr.on('data', (d) => process.stderr.write(d))

p.on('close', (code) => {
      console.log('[v0] supabase db push exited with code', code)
      process.exit(code)
})
