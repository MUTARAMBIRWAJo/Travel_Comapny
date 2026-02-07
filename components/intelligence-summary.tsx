"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, DollarSign, Leaf, ChevronDown, ChevronRight, Loader2 } from "lucide-react"

export interface IntelligenceSummaryRequest {
  id?: string
  destination?: string
  travel_date?: string
  start_date?: string
  end_date?: string
  budget_usd?: number
  budget?: number
  travellers_count?: number
  travelers_count?: number
  travel_class?: string
  transport_type?: string
  user_id?: string
  company_id?: string
  policy?: {
    max_budget_usd?: number
    allowed_destinations?: string[]
    restricted_destinations?: string[]
    require_approval_above_usd?: number
  }
}

interface Analysis {
  analyzedAt: string
  risk: { risk_level: string; risk_reasons: string[]; requires_manual_review: boolean }
  policy: { policy_score: number; violations: { rule: string; description: string; severity: string }[]; override_required: boolean }
  cost: { savings_opportunities: { type: string; recommendation: string; estimated_savings_percent?: number }[]; price_vs_historical?: string; note?: string }
  esg: { estimated_kg_co2: number; transport_type: string; offset_suggestions: string[]; note?: string }
  summary_narrative?: string
}

export function IntelligenceSummary({ request }: { request: IntelligenceSummaryRequest | null }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>("risk")

  useEffect(() => {
    if (!request) {
      setAnalysis(null)
      return
    }
    setLoading(true)
    setError(null)
    fetch("/api/intelligence/analyze-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        requestId: request.id,
        requestType: "service",
        destination: request.destination,
        destination_city: request.destination,
        start_date: request.start_date,
        end_date: request.end_date,
        travel_date: request.travel_date,
        budget_usd: request.budget_usd ?? request.budget,
        travelers_count: request.travelers_count ?? request.travellers_count ?? 1,
        travel_class: request.travel_class,
        transport_type: request.transport_type ?? "flight",
        user_id: request.user_id,
        company_id: request.company_id,
        policy: request.policy,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.analysis) setAnalysis(data.analysis)
        else setError(data?.error || "No analysis returned")
      })
      .catch(() => setError("Failed to load intelligence"))
      .finally(() => setLoading(false))
  }, [request?.id, request?.destination, request?.travel_date, request?.budget_usd])

  if (!request) return null

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Intelligence Summary
          </CardTitle>
          <CardDescription>Analyzing request…</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error || !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Intelligence Summary
          </CardTitle>
          <CardDescription>{error || "Unable to load analysis"}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const riskColor =
    analysis.risk.risk_level === "high"
      ? "bg-red-100 text-red-800"
      : analysis.risk.risk_level === "medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-green-100 text-green-800"

  const toggle = (key: string) => setExpanded((e) => (e === key ? null : key))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Intelligence Summary</CardTitle>
        <CardDescription>
          Rule-based analysis. All insights are explainable and auditable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysis.summary_narrative && (
          <p className="text-sm text-muted-foreground border-l-2 border-muted pl-3">{analysis.summary_narrative}</p>
        )}

        {/* Risk */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50"
            onClick={() => toggle("risk")}
          >
            <span className="flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4" />
              Risk
            </span>
            <span className="flex items-center gap-2">
              <Badge className={riskColor}>{analysis.risk.risk_level}</Badge>
              {analysis.risk.requires_manual_review && (
                <Badge variant="outline">Manual review</Badge>
              )}
              {expanded === "risk" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          </button>
          {expanded === "risk" && (
            <div className="px-3 pb-3 text-sm text-muted-foreground space-y-1">
              {analysis.risk.risk_reasons.map((r, i) => (
                <p key={i}>{r}</p>
              ))}
            </div>
          )}
        </div>

        {/* Policy */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50"
            onClick={() => toggle("policy")}
          >
            <span className="font-medium">Policy compliance</span>
            <span className="flex items-center gap-2">
              <Badge variant="outline">{analysis.policy.policy_score}/100</Badge>
              {analysis.policy.override_required && (
                <Badge variant="destructive">Override required</Badge>
              )}
              {expanded === "policy" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          </button>
          {expanded === "policy" && (
            <div className="px-3 pb-3 text-sm space-y-2">
              {analysis.policy.violations.length === 0 ? (
                <p className="text-muted-foreground">No violations.</p>
              ) : (
                analysis.policy.violations.map((v, i) => (
                  <p key={i} className={v.severity === "critical" ? "text-red-600" : "text-muted-foreground"}>
                    [{v.rule}] {v.description}
                  </p>
                ))
              )}
            </div>
          )}
        </div>

        {/* Cost */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50"
            onClick={() => toggle("cost")}
          >
            <span className="flex items-center gap-2 font-medium">
              <DollarSign className="w-4 h-4" />
              Cost optimization
            </span>
            {expanded === "cost" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {expanded === "cost" && (
            <div className="px-3 pb-3 text-sm text-muted-foreground space-y-2">
              {analysis.cost.savings_opportunities.length === 0 ? (
                <p>{analysis.cost.note || "No suggestions."}</p>
              ) : (
                analysis.cost.savings_opportunities.map((s, i) => (
                  <p key={i}>
                    {s.estimated_savings_percent != null && `~${s.estimated_savings_percent}%: `}
                    {s.recommendation}
                  </p>
                ))
              )}
              {analysis.cost.price_vs_historical && (
                <p>Price vs historical: {analysis.cost.price_vs_historical}</p>
              )}
            </div>
          )}
        </div>

        {/* ESG */}
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50"
            onClick={() => toggle("esg")}
          >
            <span className="flex items-center gap-2 font-medium">
              <Leaf className="w-4 h-4" />
              ESG / Carbon
            </span>
            <span className="text-sm text-muted-foreground">
              ~{analysis.esg.estimated_kg_co2} kg CO₂
            </span>
            {expanded === "esg" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {expanded === "esg" && (
            <div className="px-3 pb-3 text-sm text-muted-foreground space-y-2">
              <p>Transport: {analysis.esg.transport_type}</p>
              {analysis.esg.offset_suggestions.map((s, i) => (
                <p key={i}>{s}</p>
              ))}
              {analysis.esg.note && <p className="italic">{analysis.esg.note}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
