-- Migration: AddSequenceToPhases
-- Description: Adds sequence column to phases table for ordering phases in maintenance

BEGIN;

-- Add sequence column to phases table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'phases' AND column_name = 'sequence'
  ) THEN
    ALTER TABLE "phases"
    ADD COLUMN "sequence" INTEGER NULL;
    
    -- Set initial sequence values based on creation order (using id as fallback)
    -- This ensures existing phases have a sequence number
    UPDATE "phases"
    SET "sequence" = subquery.row_number
    FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, id ASC) as row_number
      FROM "phases"
    ) AS subquery
    WHERE "phases".id = subquery.id;
    
    RAISE NOTICE 'Column sequence added to phases table with initial values';
  ELSE
    RAISE NOTICE 'Column sequence already exists in phases table';
  END IF;
END $$;

-- Create index for sequence column
CREATE INDEX IF NOT EXISTS "IDX_phases_sequence" ON "phases" ("sequence");

COMMIT;

