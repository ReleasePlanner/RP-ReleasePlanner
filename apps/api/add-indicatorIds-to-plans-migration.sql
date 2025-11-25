-- Migration: AddIndicatorIdsToPlans
-- Description: Adds indicatorIds column to plans table

BEGIN;

-- Add indicatorIds column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'plans' AND column_name = 'indicatorIds'
  ) THEN
    ALTER TABLE "plans"
    ADD COLUMN "indicatorIds" jsonb NOT NULL DEFAULT '[]';
    
    RAISE NOTICE 'Column indicatorIds added to plans table';
  ELSE
    RAISE NOTICE 'Column indicatorIds already exists in plans table';
  END IF;
END $$;

COMMIT;

