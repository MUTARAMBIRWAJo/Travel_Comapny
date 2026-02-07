/**
 * Phase 6 — Workflow & event-driven automation.
 * Emit events on request submission, approval, etc. Handlers can send notifications, generate PDFs, log audit.
 * Rules decide; automation executes.
 */

import { createClient } from "@supabase/supabase-js"
import { logAuditEvent } from "./audit"

export type WorkflowEventType =
  | "request_submitted"
  | "approval_granted"
  | "approval_rejected"
  | "booking_confirmed"
  | "document_expired"
  | "policy_violation"

export interface WorkflowEventPayload {
  entity_type: string
  entity_id: string
  tenant_id?: string | null
  event_type: WorkflowEventType
  payload?: Record<string, unknown>
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/**
 * Emit a workflow event. Persisted to workflow_events for async processing; audit log written.
 */
export async function emitWorkflowEvent({
  entity_type,
  entity_id,
  tenant_id,
  event_type,
  payload = {},
}: WorkflowEventPayload): Promise<void> {
  const supabase = getSupabase()
  if (supabase) {
    await supabase.from("workflow_events").insert({
      event_type,
      entity_type,
      entity_id,
      tenant_id: tenant_id || null,
      payload,
    })
  }

  await logAuditEvent({
    entityType: entity_type,
    entityId: entity_id,
    action: event_type as any,
    tenantId: tenant_id || undefined,
    metadata: { workflow_event: event_type, ...payload },
  })
}

/**
 * Mark event as processed (e.g. after sending notification or generating PDF).
 */
export async function markWorkflowEventProcessed(eventId: string): Promise<void> {
  const supabase = getSupabase()
  if (supabase) {
    await supabase
      .from("workflow_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("id", eventId)
  }
}
