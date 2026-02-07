/**
 * Rule-based policy compliance scoring. No AI — explainable and auditable.
 * Checks: budget limits, travel class, destination restrictions, approval threshold.
 */

import type { AnalyzeRequestInput } from "./types"
import type { PolicyResult, PolicyViolation } from "./types"

function violation(rule: string, description: string, severity: PolicyViolation["severity"]): PolicyViolation {
  return { rule, description, severity }
}

export function runPolicyEngine(input: AnalyzeRequestInput): PolicyResult {
  const violations: PolicyViolation[] = []
  const policy = input.policy || {}

  const budget = input.budget_usd ?? (input as any).budget
  const maxBudget = policy.max_budget_usd
  if (maxBudget != null && budget != null && budget > maxBudget) {
    violations.push(
      violation(
        "budget_limit",
        `Requested budget $${budget} exceeds policy limit $${maxBudget}.`,
        maxBudget > 0 && budget > maxBudget * 1.2 ? "critical" : "warning"
      )
    )
  }

  const requireApprovalAbove = policy.require_approval_above_usd
  if (requireApprovalAbove != null && budget != null && budget > requireApprovalAbove) {
    violations.push(
      violation(
        "approval_threshold",
        `Budget $${budget} exceeds approval threshold $${requireApprovalAbove}; manager approval required.`,
        "info"
      )
    )
  }

  const dest = (input.destination_country || input.destination_city || (input as any).destination || "").toString().trim()
  const restricted = policy.restricted_destinations || []
  if (restricted.length && dest) {
    const normalizedDest = dest.toLowerCase()
    const isRestricted = restricted.some(
      (r) => r.toLowerCase() === normalizedDest || normalizedDest.includes(r.toLowerCase())
    )
    if (isRestricted) {
      violations.push(
        violation(
          "destination_restriction",
          `Destination "${dest}" is on the restricted list.`,
          "critical"
        )
      )
    }
  }

  const allowed = policy.allowed_destinations
  if (allowed?.length && dest) {
    const normalizedDest = dest.toLowerCase()
    const isAllowed = allowed.some(
      (a) => a.toLowerCase() === normalizedDest || normalizedDest.includes(a.toLowerCase())
    )
    if (!isAllowed) {
      violations.push(
        violation(
          "destination_allowed_list",
          `Destination "${dest}" may not be in the allowed destinations list.`,
          "warning"
        )
      )
    }
  }

  const travelClass = input.travel_class || (input as any).travel_class
  const classRules = policy.travel_class_rules
  if (classRules && travelClass) {
    const ruleLower = classRules.toLowerCase()
    if (ruleLower.includes("economy only") && travelClass.toLowerCase() !== "economy") {
      violations.push(
        violation("travel_class", `Policy allows economy only; requested ${travelClass}.`, "warning")
      )
    }
  }

  const criticalCount = violations.filter((v) => v.severity === "critical").length
  const warningCount = violations.filter((v) => v.severity === "warning").length
  const baseScore = 100 - criticalCount * 30 - warningCount * 10
  const policy_score = Math.max(0, Math.min(100, baseScore))
  const override_required = criticalCount > 0

  return {
    policy_score,
    violations,
    override_required,
  }
}
