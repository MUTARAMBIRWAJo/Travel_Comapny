/**
 * Role-Based Access Control (RBAC) for Phase 5.
 * Roles and permissions. Enforce at API layer via requirePermission.
 */

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  FINANCE_ADMIN: "finance_admin",
  CORPORATE_HR_MANAGER: "corporate_hr_manager",
  APPROVER: "approver",
  TRAVEL_CONSULTANT: "travel_consultant",
  AUDITOR: "auditor",
} as const

export type RoleKey = keyof typeof ROLES

/** Permissions that can be assigned to roles */
export const PERMISSIONS = {
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",
  MANAGE_ORGANIZATIONS: "manage_organizations",
  MANAGE_CONTENT: "manage_content",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_SERVICE_REQUESTS: "manage_service_requests",
  MANAGE_DOCUMENTS: "manage_documents",
  MANAGE_MESSAGES: "manage_messages",
  MANAGE_OFFICERS: "manage_officers",
  MANAGE_CURRENCY: "manage_currency",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  EXPORT_AUDIT_LOGS: "export_audit_logs",
  MANAGE_INVOICES: "manage_invoices",
  MANAGE_REFUNDS: "manage_refunds",
  MANAGE_PARTNERS: "manage_partners",
  APPROVE_REQUESTS: "approve_requests",
  VIEW_FINANCE: "view_finance",
} as const

export type PermissionKey = keyof typeof PERMISSIONS

/** Default permissions per role (admin UI and API checks) */
export const ROLE_DEFAULT_PERMISSIONS: Record<string, (typeof PERMISSIONS)[PermissionKey][]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_ORGANIZATIONS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_SERVICE_REQUESTS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.MANAGE_MESSAGES,
    PERMISSIONS.MANAGE_OFFICERS,
    PERMISSIONS.MANAGE_CURRENCY,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_AUDIT_LOGS,
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.APPROVE_REQUESTS,
    PERMISSIONS.VIEW_FINANCE,
  ],
  [ROLES.FINANCE_ADMIN]: [
    PERMISSIONS.MANAGE_CURRENCY,
    PERMISSIONS.MANAGE_INVOICES,
    PERMISSIONS.MANAGE_REFUNDS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_AUDIT_LOGS,
  ],
  [ROLES.AUDITOR]: [PERMISSIONS.VIEW_AUDIT_LOGS, PERMISSIONS.EXPORT_AUDIT_LOGS, PERMISSIONS.VIEW_ANALYTICS],
  [ROLES.TRAVEL_CONSULTANT]: [
    PERMISSIONS.MANAGE_SERVICE_REQUESTS,
    PERMISSIONS.MANAGE_MESSAGES,
    PERMISSIONS.MANAGE_DOCUMENTS,
  ],
  [ROLES.APPROVER]: [PERMISSIONS.APPROVE_REQUESTS, PERMISSIONS.VIEW_ANALYTICS],
  [ROLES.CORPORATE_HR_MANAGER]: [
    PERMISSIONS.MANAGE_ORGANIZATIONS,
    PERMISSIONS.APPROVE_REQUESTS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
}

export function roleHasPermission(
  role: string,
  permission: (typeof PERMISSIONS)[PermissionKey]
): boolean {
  const normalizedRole = role?.toString().toLowerCase()
  const perms = ROLE_DEFAULT_PERMISSIONS[normalizedRole] ?? ROLE_DEFAULT_PERMISSIONS[ROLES.ADMIN]
  return perms.includes(permission)
}
