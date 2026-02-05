import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Role-based access mapping
export const ROLE_DASHBOARDS = {
  super_admin: "/dashboard/admin",
  admin: "/dashboard/admin",
  finance_admin: "/dashboard/admin/finance",
  hr_manager: "/dashboard/admin/hr",
  approver: "/dashboard/approver",
  travel_consultant: "/dashboard/agent",
  auditor: "/dashboard/admin/audit",
  travel_agent: "/dashboard/agent",
  corporate_client: "/dashboard/corporate-client",
  corporate_employee: "/dashboard/employee",
  traveler: "/dashboard/traveler",
  guest: "/login",
}

export const ROLE_PERMISSIONS = {
  super_admin: ["manage_all", "manage_tenants", "manage_billing", "view_analytics", "manage_users", "manage_content", "manage_partners", "view_audit"],
  admin: ["manage_users", "manage_content", "view_analytics", "manage_partners"],
  finance_admin: ["view_billing", "issue_invoices", "process_refunds", "view_financial_reports"],
  hr_manager: ["manage_employees", "manage_onboarding", "view_reports"],
  approver: ["approve_requests", "view_requests"],
  travel_consultant: ["manage_bookings", "view_requests", "communicate"],
  auditor: ["view_audit", "export_audit_logs"],
  travel_agent: ["view_requests", "manage_bookings", "communicate"],
  corporate_client: ["manage_employees", "view_analytics", "set_policy"],
  corporate_employee: ["request_trip", "view_trips", "view_itineraries"],
  traveler: ["request_trip", "view_trips", "manage_profile"],
  guest: ["view_public", "contact_support"],
}
