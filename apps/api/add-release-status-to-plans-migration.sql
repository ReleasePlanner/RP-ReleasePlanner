-- Migration: AddReleaseStatusToPlans
-- Description: Adds a releaseStatus column to the plans table for tracking release outcomes

BEGIN;

-- Create enum type for release status if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'releasestatus') THEN
    CREATE TYPE releasestatus AS ENUM ('Success', 'Rollback', 'Partial RollBack');
    RAISE NOTICE 'Enum type releasestatus created';
  ELSE
    RAISE NOTICE 'Enum type releasestatus already exists';
  END IF;
END $$;

-- Add releaseStatus column to plans table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'plans' AND column_name = 'releaseStatus'
  ) THEN
    ALTER TABLE "plans"
    ADD COLUMN "releaseStatus" releasestatus NULL;
    
    RAISE NOTICE 'Column releaseStatus added to plans table';
  ELSE
    RAISE NOTICE 'Column releaseStatus already exists in plans table';
  END IF;
END $$;

COMMIT;

