/**
 * Rule-based risk scoring. No AI — explainable and auditable.
 * Inputs: destination, dates, duration, advisories (static table).
 */

import type { AnalyzeRequestInput } from "./types"
import type { RiskResult, RiskLevel } from "./types"

/** Static high-level risk by country (ISO 2 or name). Expand via DB or config in production. */
const DESTINATION_RISK: Record<string, RiskLevel> = {
  rwanda: "low",
  kenya: "medium",
  uganda: "medium",
  tanzania: "medium",
  rwa: "low",
  ken: "medium",
  uga: "medium",
  tza: "medium",
  usa: "low",
  gbr: "low",
  fra: "low",
  deu: "low",
  cdn: "low",
  zaf: "medium",
  nga: "medium",
  eth: "medium",
}

const DEFAULT_RISK: RiskLevel = "medium"

function getDestinationRisk(destination?: string): { level: RiskLevel; reason: string } {
  if (!destination) return { level: "medium", reason: "Destination not specified" }
  const normalized = destination.toLowerCase().trim().replace(/\s+/g, " ")
  const key = normalized.split(",")[0]?.trim() || normalized
  const country = key.length === 2 ? key : key.split(" ").pop() || key
  const level = DESTINATION_RISK[country] ?? DESTINATION_RISK[normalized] ?? DEFAULT_RISK
  return {
    level,
    reason: `Destination ${destination} has ${level} risk rating (rule-based advisory).`,
  }
}

function getDurationRisk(days?: number): { level: RiskLevel; reason: string } | null {
  if (days == null || days <= 0) return null
  if (days > 21) return { level: "high", reason: "Trip duration over 21 days may require additional review." }
  if (days > 14) return { level: "medium", reason: "Trip duration over 14 days." }
  return null
}

export function runRiskEngine(input: AnalyzeRequestInput): RiskResult {
  const reasons: string[] = []
  let maxLevel: RiskLevel = "low"

  const dest = getDestinationRisk(input.destination_country || input.destination_city || (input as any).destination)
  reasons.push(dest.reason)
  if (dest.level === "high") maxLevel = "high"
  else if (dest.level === "medium" && maxLevel === "low") maxLevel = "medium"

  const durationDays =
    input.trip_duration_days ??
    (input.start_date && input.end_date
      ? Math.ceil((new Date(input.end_date).getTime() - new Date(input.start_date).getTime()) / (24 * 60 * 60 * 1000))
      : undefined)
  const durationRisk = getDurationRisk(durationDays)
  if (durationRisk) {
    reasons.push(durationRisk.reason)
    if (durationRisk.level === "high") maxLevel = "high"
    else if (durationRisk.level === "medium" && maxLevel === "low") maxLevel = "medium"
  }

  const requires_manual_review = maxLevel === "high" || reasons.some((r) => r.includes("additional review"))

  return {
    risk_level: maxLevel,
    risk_reasons: reasons,
    requires_manual_review,
  }
}
