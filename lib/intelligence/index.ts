/**
 * Phase 6 — Intelligence Layer orchestrator.
 * Runs all rule-based engines and optionally caches by requestId. AI narrative is advisory only.
 */

import type { AnalyzeRequestInput, IntelligenceAnalysis } from "./types"
import { runRiskEngine } from "./riskEngine"
import { runPolicyEngine } from "./policyEngine"
import { runCostEngine } from "./costEngine"
import { runEsgEngine } from "./esgEngine"
import { getCached, setCached, cacheKey } from "@/lib/cache"

const INTELLIGENCE_CACHE_TTL = 300

/**
 * Analyze a travel/service request: risk, policy, cost, ESG.
 * All logic is rule-based and explainable; no black-box decisions.
 */
export function analyzeRequest(input: AnalyzeRequestInput): IntelligenceAnalysis {
  const risk = runRiskEngine(input)
  const policy = runPolicyEngine(input)
  const cost = runCostEngine(input)
  const esg = runEsgEngine(input)

  const analysis: IntelligenceAnalysis = {
    requestId: input.requestId,
    analyzedAt: new Date().toISOString(),
    risk,
    policy,
    cost,
    esg,
    summary_narrative: buildAdvisoryNarrative(risk, policy, cost, esg),
  }

  return analysis
}

/**
 * Advisory-only narrative (no decision logic). Can be replaced by AI-generated text later.
 */
function buildAdvisoryNarrative(
  risk: IntelligenceAnalysis["risk"],
  policy: IntelligenceAnalysis["policy"],
  cost: IntelligenceAnalysis["cost"],
  esg: IntelligenceAnalysis["esg"]
): string {
  const parts: string[] = []
  parts.push(`Risk: ${risk.risk_level}. ${risk.risk_reasons.join(" ")}`)
  parts.push(`Policy score: ${policy.policy_score}/100. ${policy.violations.length > 0 ? "Violations require review." : "No violations."}`)
  if (cost.savings_opportunities.length > 0) {
    parts.push(`Cost: ${cost.savings_opportunities.length} optimization suggestion(s) available.`)
  }
  parts.push(`ESG: Estimated ${esg.estimated_kg_co2} kg CO2 (${esg.transport_type}).`)
  return parts.join(" ")
}

/**
 * Get cached analysis for a request ID, or run and cache.
 */
export function getOrAnalyze(input: AnalyzeRequestInput): IntelligenceAnalysis {
  const id = input.requestId
  if (id) {
    const cached = getCached<IntelligenceAnalysis>(cacheKey("intelligence", id))
    if (cached) return cached
  }

  const analysis = analyzeRequest(input)
  if (id) {
    setCached(cacheKey("intelligence", id), analysis, INTELLIGENCE_CACHE_TTL)
  }
  return analysis
}
