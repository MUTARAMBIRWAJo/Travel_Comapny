/**
 * Phase 6 — Intelligence Layer types.
 * AI assists; rules decide. All outputs are explainable and auditable.
 */

export type RiskLevel = "low" | "medium" | "high"

export interface RiskResult {
  risk_level: RiskLevel
  risk_reasons: string[]
  requires_manual_review: boolean
}

export interface PolicyViolation {
  rule: string
  description: string
  severity: "info" | "warning" | "critical"
}

export interface PolicyResult {
  policy_score: number
  violations: PolicyViolation[]
  override_required: boolean
}

export interface SavingsOpportunity {
  type: "date_shift" | "alternative_route" | "package_alternative" | "currency" | "early_booking"
  estimated_savings_percent?: number
  estimated_savings_amount?: number
  recommendation: string
  metadata?: Record<string, unknown>
}

export interface CostResult {
  savings_opportunities: SavingsOpportunity[]
  price_vs_historical?: "below" | "average" | "above"
  note?: string
}

export interface ESGResult {
  estimated_kg_co2: number
  transport_type: string
  distance_km?: number
  offset_suggestions: string[]
  note?: string
}

export interface AnalyzeRequestInput {
  requestId?: string
  requestType?: "travel" | "service"
  destination_country?: string
  destination_city?: string
  start_date?: string
  end_date?: string
  travel_date?: string
  trip_duration_days?: number
  budget_usd?: number
  travelers_count?: number
  travel_class?: string
  transport_type?: "flight" | "train" | "car" | "other"
  /** Distance in km (optional; ESG engine estimates if omitted) */
  distance_km?: number
  destination?: string
  user_id?: string
  company_id?: string
  /** Snapshot of company policy (optional) */
  policy?: {
    max_budget_usd?: number
    allowed_destinations?: string[]
    restricted_destinations?: string[]
    travel_class_rules?: string
    require_approval_above_usd?: number
  }
}

export interface IntelligenceAnalysis {
  requestId?: string
  analyzedAt: string
  risk: RiskResult
  policy: PolicyResult
  cost: CostResult
  esg: ESGResult
  /** Advisory-only narrative (e.g. from AI); not used for decisions */
  summary_narrative?: string
}
