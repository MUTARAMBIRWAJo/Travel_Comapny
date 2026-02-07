-- Phase 6: Workflow events for event-driven automation and SLA/reminders
-- Events: request_submitted, approval_granted, approval_rejected, booking_confirmed, document_expired, policy_violation
-- Safe to run in any order: uses IF NOT EXISTS and conditional ALTER.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS workflow_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  tenant_id uuid,
  payload jsonb DEFAULT '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflow_events_type_created ON workflow_events (event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_workflow_events_entity ON workflow_events (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_workflow_events_unprocessed ON workflow_events (processed_at) WHERE processed_at IS NULL;

-- Optional: SLA columns on request tables (only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travel_requests') THEN
    ALTER TABLE travel_requests ADD COLUMN IF NOT EXISTS submitted_at timestamptz;
    ALTER TABLE travel_requests ADD COLUMN IF NOT EXISTS sla_due_at timestamptz;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_requests') THEN
    ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS submitted_at timestamptz;
    ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS sla_due_at timestamptz;
  END IF;
END $$;

COMMENT ON TABLE workflow_events IS 'Event-driven automation: triggers for notifications, PDF, audit, re-analysis';
