-- Migration: RenamePhaseReschedulesToPlanPhaseReschedules
-- Description: Renames phase_reschedules table to plan_phase_reschedules

BEGIN;

-- Rename table
ALTER TABLE IF EXISTS "phase_reschedules" RENAME TO "plan_phase_reschedules";

-- Rename primary key constraint
ALTER TABLE IF EXISTS "plan_phase_reschedules" 
  RENAME CONSTRAINT "PK_phase_reschedules" TO "PK_plan_phase_reschedules";

-- Rename indexes
ALTER INDEX IF EXISTS "IDX_phase_reschedules_planPhaseId" 
  RENAME TO "IDX_plan_phase_reschedules_planPhaseId";

ALTER INDEX IF EXISTS "IDX_phase_reschedules_rescheduledAt" 
  RENAME TO "IDX_plan_phase_reschedules_rescheduledAt";

ALTER INDEX IF EXISTS "IDX_phase_reschedules_rescheduleTypeId" 
  RENAME TO "IDX_plan_phase_reschedules_rescheduleTypeId";

ALTER INDEX IF EXISTS "IDX_phase_reschedules_ownerId" 
  RENAME TO "IDX_plan_phase_reschedules_ownerId";

-- Rename foreign key constraints
ALTER TABLE IF EXISTS "plan_phase_reschedules" 
  RENAME CONSTRAINT "FK_phase_reschedules_planPhase" TO "FK_plan_phase_reschedules_planPhase";

ALTER TABLE IF EXISTS "plan_phase_reschedules" 
  RENAME CONSTRAINT "FK_phase_reschedules_reschedule_type" TO "FK_plan_phase_reschedules_reschedule_type";

ALTER TABLE IF EXISTS "plan_phase_reschedules" 
  RENAME CONSTRAINT "FK_phase_reschedules_owner" TO "FK_plan_phase_reschedules_owner";

COMMIT;

