#!/usr/bin/env node
// dispatch-workflow.js
// Usage: set env vars GITHUB_TOKEN and REPO (owner/repo), then run: node scripts/dispatch-workflow.js
// Optional env vars: WORKFLOW_FILE (default: migrate-seed.yml), REF (default: main), TIMEOUT_MS

import fs from 'fs'
import path from 'path'

const token = process.env.GITHUB_TOKEN
const repo = process.env.REPO
const workflowFile = process.env.WORKFLOW_FILE || 'migrate-seed.yml'
const ref = process.env.REF || 'main'
const timeoutMs = Number(process.env.TIMEOUT_MS || 20 * 60 * 1000) // default 20 minutes
const pollInterval = 5000

if (!token || !repo) {
      console.error('Error: GITHUB_TOKEN and REPO env vars are required. REPO should be in "owner/repo" format.')
      process.exit(1)
}

const headers = {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'migrate-seed-dispatch-script',
      Accept: 'application/vnd.github+json'
}

async function fetchJson(url, opts = {}) {
      const res = await fetch(url, { ...opts, headers })
      if (!res.ok) {
            const txt = await res.text()
            throw new Error(`${res.status} ${res.statusText}: ${txt}`)
      }
      return res.json()
}

async function postDispatch() {
      const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflowFile}/dispatches`
      console.log(`Dispatching workflow ${workflowFile} on ${repo}@${ref}...`)
      const body = JSON.stringify({ ref })
      const res = await fetch(url, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body })
      if (res.status === 204) {
            console.log('Workflow dispatched successfully.')
            return true
      }
      const txt = await res.text()
      throw new Error(`Failed to dispatch: ${res.status} ${res.statusText}: ${txt}`)
}

async function findRun() {
      const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflowFile}/runs?event=workflow_dispatch&branch=${encodeURIComponent(ref)}`
      const json = await fetchJson(url)
      const runs = json.workflow_runs || []
      if (runs.length === 0) return null
      // Return the latest run
      return runs[0]
}

async function getRun(runId) {
      const url = `https://api.github.com/repos/${repo}/actions/runs/${runId}`
      return fetchJson(url)
}

async function listArtifacts(runId) {
      const url = `https://api.github.com/repos/${repo}/actions/runs/${runId}/artifacts`
      return fetchJson(url)
}

async function downloadArtifact(artifact, destDir) {
      const url = artifact.archive_download_url
      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error(`Failed to download artifact ${artifact.name}: ${res.status} ${res.statusText}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      const outPath = path.join(destDir, `${artifact.name}.zip`)
      fs.mkdirSync(destDir, { recursive: true })
      fs.writeFileSync(outPath, buffer)
      console.log(`Saved artifact ${artifact.name} to ${outPath}`)
}

async function main() {
      const start = Date.now()
      try {
            await postDispatch()
      } catch (err) {
            console.error('Dispatch error:', err.message)
            process.exit(2)
      }

      console.log('Waiting for workflow run to appear...')
      let run = null
      const deadline = Date.now() + timeoutMs
      while (Date.now() < deadline) {
            try {
                  const found = await findRun()
                  if (found && (found.status === 'queued' || found.status === 'in_progress' || found.status === 'completed')) {
                        run = found
                        break
                  }
            } catch (err) {
                  console.warn('Warning while polling for run:', err.message)
            }
            await new Promise((r) => setTimeout(r, pollInterval))
      }

      if (!run) {
            console.error('Timed out waiting for a workflow run to appear.')
            process.exit(3)
      }

      console.log(`Found run id=${run.id}, status=${run.status}, conclusion=${run.conclusion || 'N/A'}`)

      // Poll run until completion
      while (Date.now() < deadline) {
            const details = await getRun(run.id)
            console.log(`Run status: ${details.status} ${details.conclusion ? `(${details.conclusion})` : ''}`)
            if (details.status === 'completed') {
                  if (details.conclusion === 'success') {
                        console.log('Workflow completed successfully ✅')
                  } else {
                        console.warn(`Workflow completed with conclusion: ${details.conclusion}`)
                  }

                  // Download artifacts
                  try {
                        const arts = await listArtifacts(run.id)
                        const artifacts = arts.artifacts || []
                        if (artifacts.length === 0) {
                              console.log('No artifacts found for this run.')
                        } else {
                              const dest = path.join(process.cwd(), 'tmp', `actions-artifacts-${run.id}`)
                              for (const a of artifacts) {
                                    await downloadArtifact(a, dest)
                              }
                              console.log(`Downloaded ${artifacts.length} artifacts to ${dest}`)
                        }
                  } catch (err) {
                        console.warn('Error downloading artifacts:', err.message)
                  }
                  process.exit(details.conclusion === 'success' ? 0 : 4)
            }

            await new Promise((r) => setTimeout(r, pollInterval))
      }

      console.error('Timed out waiting for run to complete')
      process.exit(5)
}

main().catch((err) => {
      console.error('Fatal error:', err)
      process.exit(99)
})
