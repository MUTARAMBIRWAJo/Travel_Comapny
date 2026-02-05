# Phase 4 Implementation Plan — Corporate Travel Management Platform

## Goals
Harden platform for production with performance, security, auditability and a CMS-managed legal content system.

## Checklist
- [ ] Analyze current codebase and DB schema related to CMS, auth, sessions, admin lists, and public APIs
- [ ] Add DB migrations for:
  - [ ] CMS page versioning & publish flag
  - [ ] Audit logs for admin actions & auth events
  - [ ] Encryption-ready columns for sensitive user data
  - [ ] Rate-limit counters (if using DB-backed limiter)
- [ ] Implement API response caching for public pages (edge/ISR or server cache)
- [ ] Implement pagination on all admin list endpoints & UI
- [ ] Add background job system (queues) and workers for:
  - [ ] Emails (async send + retry)
  - [ ] Reports (generation + storage)
- [ ] Add rate limiting middleware on public APIs (IP + auth key rules)
- [ ] Add access logging:
  - [ ] Admin actions (CRUD on admin endpoints)
  - [ ] Authentication events (login, logout, failed login)
- [ ] Encrypt sensitive data at rest (e.g., personal ID, passport numbers)
- [ ] Enforce password complexity (registration + reset + admin set)
- [ ] Implement session expiration & refresh logic (short-lived sessions + refresh token or re-auth)
- [ ] Create CMS admin UI changes:
  - [ ] Page editor with versioning and publish control
  - [ ] Audit trail for edits (who, when, what)
  - [ ] Media support (existing media uploader)
- [ ] Seed initial legal pages (editable versions):
  - [ ] Privacy Policy
  - [ ] Terms & Conditions
  - [ ] Travel Liability Disclaimer
  - [ ] Data Protection Notice
  - [ ] Cookies Policy
  - [ ] Corporate Travel Policy Template
  - [ ] Government & Regulatory Compliance Notice
- [ ] Ensure legal content follows strict rules (no legal guarantees, intermediary disclaimer, Rwanda reference high-level, recommend legal review)
- [ ] Public site integration:
  - [ ] Render pages dynamically from CMS
  - [ ] Add links in footer
  - [ ] Apply SEO meta dynamically
  - [ ] Display "Last Updated" from published version metadata
- [ ] Tests:
  - [ ] Unit tests for new middleware and utilities
  - [ ] Integration tests for CMS publish flow and public rendering
  - [ ] E2E checks for footer links and pages
- [ ] Documentation & deployment:
  - [ ] Update DEPLOYMENT_CHECKLIST.md for migration and background workers
  - [ ] Provide DB migration and seed scripts
  - [ ] Add monitoring/alerts for rate limits, queue failures, and encryption key issues
- [ ] Security review & final verification:
  - [ ] Confirm no breaking changes
  - [ ] Confirm admin actions auditable
  - [ ] Confirm legal pages editable and published versions visible publicly

## Implementation notes
- Prefer non-breaking, incremental changes and DB migrations.
- Use existing CMS APIs as base; add versioning + publish flag.
- Use a small queue (e.g., BullMQ/Redis or serverless job queue) depending on infra.
- Use environment-managed encryption key for data-at-rest encryption.
- Keep legal content neutral and include a disclaimer recommending legal review.