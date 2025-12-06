-- Migration: AddSequenceToPlanPhases
-- Description: Adds sequence column to plan_phases table to track the sequential order of phases

BEGIN;

-- Add sequence column to plan_phases table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'plan_phases' AND column_name = 'sequence'
  ) THEN
    ALTER TABLE "plan_phases"
    ADD COLUMN "sequence" INTEGER NULL;
    
    RAISE NOTICE 'Column sequence added to plan_phases table';
  ELSE
    RAISE NOTICE 'Column sequence already exists in plan_phases table';
  END IF;
END $$;

-- Create index for sequence column
CREATE INDEX IF NOT EXISTS "IDX_plan_phases_sequence" ON "plan_phases" ("sequence");

-- Create composite index for planId and sequence for efficient ordering
CREATE INDEX IF NOT EXISTS "IDX_plan_phases_planId_sequence" ON "plan_phases" ("planId", "sequence");

COMMIT;

