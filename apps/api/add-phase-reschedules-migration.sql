-- Migration: AddPhaseReschedules
-- Description: Creates phase_reschedules table to track phase date changes

BEGIN;

-- Create phase_reschedules table
CREATE TABLE IF NOT EXISTS "phase_reschedules" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "planPhaseId" uuid NOT NULL,
  "rescheduledAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "originalStartDate" DATE,
  "originalEndDate" DATE,
  "newStartDate" DATE,
  "newEndDate" DATE,
  CONSTRAINT "PK_phase_reschedules" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "IDX_phase_reschedules_planPhaseId" ON "phase_reschedules" ("planPhaseId");
CREATE INDEX IF NOT EXISTS "IDX_phase_reschedules_rescheduledAt" ON "phase_reschedules" ("rescheduledAt");

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'FK_phase_reschedules_planPhase'
  ) THEN
    ALTER TABLE "phase_reschedules"
    ADD CONSTRAINT "FK_phase_reschedules_planPhase"
    FOREIGN KEY ("planPhaseId") REFERENCES "plan_phases"("id") ON DELETE CASCADE;
  END IF;
END $$;

COMMIT;

