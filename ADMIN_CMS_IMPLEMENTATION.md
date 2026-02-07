# Admin & CMS Layer – Implementation Summary

This document summarizes the Admin and CMS layer added to the Corporate Travel Management Platform. Existing dashboards and APIs are unchanged; all new behavior is additive and auditable.

---

## 1. Admin User Management

**Backend**
- **GET /api/admin/users** – List users (optional filters: `role`, `companyId`). Returns `full_name`, `role`, `status`, `company_id`.
- **POST /api/admin/users** – Create user. Body: `email`, `full_name`, `role`, `company_id`, optional `password`. Uses `full_name` and `status: 'active'`.
- **GET/PUT/DELETE /api/admin/users/[id]** – Get, update (role, status, full_name, company_id), or delete user.
- **Suspend/activate** – Set `status` to `suspended` or `active` via PUT.
- **Protection** – Users with roles `ADMIN`, `ADMINISTRATOR`, `SYSTEM`, `SUPER_ADMIN` cannot be deleted.
- **Audit** – All create/update/delete/suspend/activate actions are logged via `logAuditEvent` (entity `user`, actions `create`/`update`/`delete`/`suspend`/`activate`).

**Frontend**
- **Dashboard → User Management** – List, create (with organization dropdown), edit (role, status, organization), delete. Role assignment and suspend/activate in edit form.

---

## 2. Role & Permission Management

**Backend**
- **GET/POST /api/admin/roles** – List and create roles. Body: `name`, `description`, `permissions` (array).
- **GET/PUT/DELETE /api/admin/roles/[id]** – Get, update permissions/description, or delete role.
- **Protection** – Roles whose `name` is in `ADMIN`, `TRAVEL_AGENT`, `CORPORATE_CLIENT`, `CORPORATE_EMPLOYEE`, `INDIVIDUAL_TRAVELER` cannot be deleted.
- **Audit** – Role changes logged.

**Frontend**
- **Dashboard → Role Management** – List roles, create, edit (description and permissions as comma-separated), delete. No drag-and-drop; permissions are explicit.

---

## 3. Organization Management

**Backend**
- **GET/POST /api/admin/organizations** – List and create organizations (companies). Body: `name`, `billing_email`, optional `settings`.
- **GET/PUT/DELETE /api/admin/organizations/[id]** – Get, update (name, billing_email, settings, **admin_user_id**), or delete.
- **Audit** – Organization create/update/delete logged.

**Frontend**
- **Dashboard → Organizations** – List, create, edit. Edit form includes **Organization admin** dropdown (assign a user as org admin via `admin_user_id`).

---

## 4. CMS: Public Pages Management

**Backend**
- **GET /api/admin/pages** – List all CMS pages.
- **POST /api/admin/pages** – Create/upsert page. Body: `title`, `slug`, `status` (draft | published), `seo_title`, `seo_description`, `sections` (array of `{ type, content_json }`).
- **GET/PUT/DELETE /api/admin/pages/[id]** – Get page + sections (normalized to `type` and `content_json`), update, or delete.
- **Sections** – Stored with `type` and `content_json` (JSON). Supported section types: `text`, `hero`, `features`, `cta`.
- **Versioning** – On save, a row is inserted into `cms_page_versions` (page_key, title_en, seo_title, seo_description, is_published, published_at, created_by). When status is `published`, other versions for the same page_key are unpublished.
- **Audit** – Page create/update/delete and publish actions logged.

**Frontend (Admin)**
- **Dashboard → Content → Pages** – List pages, link to edit.
- **Dashboard → Pages → [id]** – **Page editor**: title, slug, SEO title/description, status (draft/published). **Section-based UI**: add/remove sections; per-section type select (Text, Hero, Features, CTA) and fields (e.g. hero title/subtitle, CTA href/text, features as JSON array). Save updates page and sections; “View page” link when published.

---

## 5. Dynamic Public Pages

**Frontend (Public)**
- **Route** – `app/[slug]/page.tsx` serves dynamic pages by slug.
- **Data** – Fetches the latest **published** version from `cms_page_versions` by `page_key` (= slug) and sections from `cms_page_sections` (normalized to `type` and `content_json`).
- **Rendering** – Renders sections via `SectionRenderer`: hero (title, subtitle), text (text), features (items array), CTA (href, text). Only published pages are shown.
- **SEO** – `generateMetadata` uses `seo_title` and `seo_description` from the published version.
- **Layout** – Page uses site `Navbar` and `Footer` for consistency.

---

## 6. Media Library

**Backend**
- **GET /api/admin/media** – List media (from `cms_media`).
- **POST /api/admin/media/upload** – Upload file (multipart); stored in Supabase Storage and metadata in `cms_media`. Audited.
- **DELETE /api/admin/media/[id]** – Delete media record and audited.

**Frontend**
- **Dashboard → Content → Media** – Existing **MediaUploader**: drag-and-drop upload, grid of items with preview, delete, copy link. Reused as the media manager; no new UI.

---

## 7. Site Settings

**Backend**
- **GET /api/admin/site-settings** – List all site settings (admin-only).
- **POST /api/admin/site-settings** – Upsert setting. Body: `key`, `value`, `type` (string | number | boolean | json), optional `description`. Audited.
- **GET /api/site-settings** – **Public** API: returns key-value map of all settings (no auth). Used by public pages for dynamic config. Cache headers: `public, max-age=60, s-maxage=300`.

**Frontend**
- **Dashboard → Settings** – List settings, edit value inline, **Add Setting** form (key, value, type, description).

---

## Database Migration

**File:** `supabase/migrations/20260207_admin_cms_schema.sql`

Adds columns only if missing (safe to run multiple times):

- **users** – `status` (VARCHAR, default `'active'`) for suspend/activate.
- **companies** – `billing_email`, `settings` (JSONB), `admin_user_id` (FK to users).
- **cms_page_sections** – `content_json` (JSONB), `type` (VARCHAR).
- **cms_pages** – `slug`, `title`, `seo_title`, `seo_description` (if not present).

Run with your Supabase CLI or apply the SQL in the dashboard.

---

## Security & Audit

- **Admin routes** – All `/api/admin/*` routes use `requireAdmin()` (roles: admin, administrator, super_admin; case-insensitive). No new public admin endpoints.
- **Audit** – User, role, organization, page, media, and site setting changes are logged via `lib/audit.ts` (`logAuditEvent`). Actions include create, update, delete, suspend, activate where applicable.
- **System roles** – Users with system roles and core role names cannot be deleted as specified above.

---

## What Was Not Implemented

- No third-party CMS or WYSIWYG; section content is structured (type + JSON).
- No multilingual content in this phase.
- No permission middleware beyond role checks (admin vs non-admin); role permissions are stored and editable but not enforced per-route in this pass.

---

## Quick Checklist

- [x] Admin user list, create, edit, suspend/activate, delete with audit and system-role protection.
- [x] Role list, create, edit permissions, delete with core-role protection.
- [x] Organization list, create, edit with org admin assignment.
- [x] CMS pages list, create, edit with section-based editor and publish/unpublish.
- [x] Public pages by slug with dynamic sections and SEO.
- [x] Media library (upload, list, delete) and audit.
- [x] Site settings (admin CRUD + public read API) and add-new UI.
- [x] Migration for new columns; existing dashboards/APIs unchanged.
