/**
 * Rule-based cost optimization suggestions. No AI — explainable and auditable.
 * Detects: date shift, early booking, alternative package, currency (placeholder).
 */

import type { AnalyzeRequestInput } from "./types"
import type { CostResult, SavingsOpportunity } from "./types"

export function runCostEngine(input: AnalyzeRequestInput): CostResult {
  const savings_opportunities: SavingsOpportunity[] = []

  const start = input.start_date || input.travel_date
  const end = input.end_date
  const budget = input.budget_usd ?? (input as any).budget

  if (start) {
    const d = new Date(start)
    const dayOfWeek = d.getDay()
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      savings_opportunities.push({
        type: "date_shift",
        estimated_savings_percent: 15,
        recommendation: "Weekday travel often costs less; consider shifting by 1–2 days.",
      })
    }
  }

  if (start && end) {
    const startMs = new Date(start).getTime()
    const endMs = new Date(end).getTime()
    const days = Math.ceil((endMs - startMs) / (24 * 60 * 60 * 1000))
    if (days >= 7) {
      savings_opportunities.push({
        type: "early_booking",
        estimated_savings_percent: 10,
        recommendation: "Booking 2–4 weeks in advance for trips over 7 days can yield savings.",
      })
    }
  }

  if (budget && budget > 5000) {
    savings_opportunities.push({
      type: "package_alternative",
      estimated_savings_percent: 5,
      recommendation: "For this budget range, bundled packages may offer better value.",
    })
  }

  let price_vs_historical: CostResult["price_vs_historical"] = "average"
  if (budget) {
    if (budget > 8000) price_vs_historical = "above"
    else if (budget < 2000) price_vs_historical = "below"
  }

  return {
    savings_opportunities,
    price_vs_historical,
    note:
      savings_opportunities.length > 0
        ? "Suggestions are rule-based and indicative; actual savings may vary."
        : "No automatic optimization tips for this request.",
  }
}
