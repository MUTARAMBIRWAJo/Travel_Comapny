import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Role-based access mapping
export const ROLE_DASHBOARDS = {
  admin: "/dashboard/admin",
  travel_agent: "/dashboard/agent",
  corporate_client: "/dashboard/corporate-client",
  corporate_employee: "/dashboard/employee",
  traveler: "/dashboard/traveler",
  guest: "/login",
}

export const ROLE_PERMISSIONS = {
  admin: ["manage_all", "view_analytics", "manage_users", "manage_content"],
  travel_agent: ["view_requests", "manage_bookings", "communicate"],
  corporate_client: ["manage_employees", "view_analytics", "set_policy"],
  corporate_employee: ["request_trip", "view_trips", "view_itineraries"],
  traveler: ["request_trip", "view_trips", "manage_profile"],
  guest: ["view_public", "contact_support"],
}
