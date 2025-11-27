-- Migration: AddMetricValuesToPlanPhases
-- Description: Adds metricValues column to plan_phases table

BEGIN;

-- Add metricValues column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'plan_phases' AND column_name = 'metricValues'
  ) THEN
    ALTER TABLE "plan_phases"
    ADD COLUMN "metricValues" jsonb NOT NULL DEFAULT '{}';
    
    RAISE NOTICE 'Column metricValues added to plan_phases table';
  ELSE
    RAISE NOTICE 'Column metricValues already exists in plan_phases table';
  END IF;
END $$;

COMMIT;

