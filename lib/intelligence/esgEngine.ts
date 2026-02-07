/**
 * Rule-based ESG / carbon estimation. No AI — explainable and auditable.
 * Uses distance (or default), transport type. Offset suggestions aligned with Rwanda ESG priorities.
 */

import type { AnalyzeRequestInput } from "./types"
import type { ESGResult } from "./types"

/** Approximate kg CO2 per passenger per km (source: high-level industry averages). */
const KG_CO2_PER_KM: Record<string, number> = {
  flight: 0.255,
  train: 0.041,
  car: 0.171,
  other: 0.1,
}

/** Default distance (km) when unknown — e.g. regional East Africa. */
const DEFAULT_DISTANCE_KM = 1500

function estimateDistance(destination?: string): number {
  if (!destination) return DEFAULT_DISTANCE_KM
  const d = destination.toLowerCase()
  if (d.includes("nairobi") || d.includes("kenya")) return 900
  if (d.includes("kampala") || d.includes("uganda")) return 450
  if (d.includes("dar") || d.includes("tanzania")) return 1100
  if (d.includes("paris") || d.includes("france")) return 6200
  if (d.includes("london") || d.includes("uk")) return 6700
  if (d.includes("dubai") || d.includes("uae")) return 3400
  return DEFAULT_DISTANCE_KM
}

export function runEsgEngine(input: AnalyzeRequestInput): ESGResult {
  const transport = input.transport_type || "flight"
  const distance_km = input.distance_km ?? estimateDistance(input.destination_country || input.destination_city || (input as any).destination)
  const factor = KG_CO2_PER_KM[transport] ?? KG_CO2_PER_KM.other
  const travelers = input.travelers_count ?? 1
  const estimated_kg_co2 = Math.round(distance_km * factor * travelers)

  const offset_suggestions: string[] = [
    "Consider verified carbon offset programmes (e.g. Rwanda forestry or renewable energy projects).",
    "Prefer direct flights where possible to reduce emissions from take-off/landing.",
  ]
  if (transport === "flight" && distance_km > 3000) {
    offset_suggestions.push("Long-haul flights have higher carbon impact; offset recommendation is encouraged.")
  }

  return {
    estimated_kg_co2,
    transport_type: transport,
    distance_km,
    offset_suggestions,
    note: "Estimates are rule-based and indicative; not a substitute for formal carbon accounting.",
  }
}
