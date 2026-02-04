import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name: string, role: string, companyId?: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const passwordHash = await hashPassword(password)

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name,
      role,
      company_id: companyId || null,
      preferred_language: "EN",
      preferred_currency: "USD",
      status: "active",
    })
    .select()
    .single()

  if (error) throw error

  return user
}

export async function getUserByEmail(email: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: user, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase()).single()

  if (error) throw error

  return user
}

export async function validateCredentials(email: string, password: string) {
  try {
    const user = await getUserByEmail(email)
    if (!user) return null

    const isValid = await verifyPassword(password, user.password_hash)
    return isValid ? user : null
  } catch (error) {
    return null
  }
}
