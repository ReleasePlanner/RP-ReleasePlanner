-- Migration: SetDefaultReleaseStatus
-- Description: Sets default releaseStatus to "To Be Defined" for all existing plans that have NULL releaseStatus

BEGIN;

-- First, add "To Be Defined" to the enum if it doesn't exist
DO $$ 
BEGIN
    -- Check if "To Be Defined" value exists in the enum
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum 
        WHERE enumlabel = 'To Be Defined' 
        AND enumtypid = (
            SELECT oid 
            FROM pg_type 
            WHERE typname = 'releasestatus'
        )
    ) THEN
        -- Add "To Be Defined" to the enum (must be added before the existing values)
        ALTER TYPE "releasestatus" ADD VALUE IF NOT EXISTS 'To Be Defined' BEFORE 'Success';
        RAISE NOTICE 'Added "To Be Defined" to releasestatus enum.';
    ELSE
        RAISE NOTICE '"To Be Defined" already exists in releasestatus enum.';
    END IF;
END $$;

-- Update all plans with NULL releaseStatus to "To Be Defined"
UPDATE "plans"
SET "releaseStatus" = 'To Be Defined'
WHERE "releaseStatus" IS NULL;

-- Verify the update
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count
    FROM "plans"
    WHERE "releaseStatus" = 'To Be Defined';
    
    RAISE NOTICE 'Updated % plans to have releaseStatus = "To Be Defined"', updated_count;
END $$;

COMMIT;

