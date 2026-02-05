Triggering the "Migrate and Seed Database" workflow

This repository includes a convenience script to dispatch the `migrate-seed.yml` workflow, poll for completion, and download artifacts (logs).

Files created:
- `scripts/dispatch-workflow.js` — dispatch + monitor script (Node, uses global `fetch`; run on Node 18+)

Requirements
- A Personal Access Token or GitHub Actions PAT with `repo` and `workflow` permissions set in `GITHUB_TOKEN` env var.
- `REPO` environment variable set to the repository full name, e.g., `my-org/my-repo`.

Usage (example in PowerShell):

$env:GITHUB_TOKEN = "ghp_...YOURTOKEN..."
$env:REPO = "OWNER/REPO"
# optionally: $env:WORKFLOW_FILE = "migrate-seed.yml"; $env:REF = "main"
node scripts/dispatch-workflow.js

What the script does
- Dispatches `migrate-seed.yml` against the configured `REF` (default: `main`).
- Polls until a workflow run appears and waits for it to complete (timeout: 20 minutes by default).
- If artifacts are available, downloads them to `./tmp/actions-artifacts-<runId>/`.

Security and notes
- Keep your token secret; avoid committing tokens to the repo.
- You can also run the workflow via the GitHub Actions UI: Actions → Migrate and Seed Database → Run workflow.

If you'd like, I can run this script from here if you provide a temporary PAT (set as `GITHUB_TOKEN`) and the `REPO` value, or you can run it locally and share the resulting artifact ZIPs for inspection.