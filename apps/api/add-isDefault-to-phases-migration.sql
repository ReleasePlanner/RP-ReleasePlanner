-- Migration: AddIsDefaultToPhases
-- Description: Adds isDefault column to phases table to indicate if a phase should be included by default when creating a new plan

BEGIN;

-- Add isDefault column to phases table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'phases' AND column_name = 'isDefault'
  ) THEN
    ALTER TABLE "phases"
    ADD COLUMN "isDefault" BOOLEAN NOT NULL DEFAULT FALSE;
    
    RAISE NOTICE 'Column isDefault added to phases table';
  ELSE
    RAISE NOTICE 'Column isDefault already exists in phases table';
  END IF;
END $$;

-- Create index for isDefault column
CREATE INDEX IF NOT EXISTS "IDX_phases_isDefault" ON "phases" ("isDefault");

COMMIT;

