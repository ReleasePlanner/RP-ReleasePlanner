-- Migration: CreateIndicators (1764000000000)
-- Create indicators table for KPIs/Indicators maintenance
-- Fields: id, name, description, formula (optional), status

BEGIN;

-- Create indicators table
CREATE TABLE IF NOT EXISTS "indicators" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT NULL,
  "formula" TEXT NULL,
  "status" VARCHAR(50) NOT NULL DEFAULT 'active',
  CONSTRAINT "PK_indicators" PRIMARY KEY ("id")
);

-- Create unique index on name
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_indicators_name" ON "indicators" ("name");

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS "IDX_indicators_status" ON "indicators" ("status");

-- Add check constraint for status enum values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'CHK_indicators_status'
  ) THEN
    ALTER TABLE "indicators" 
    ADD CONSTRAINT "CHK_indicators_status" 
    CHECK ("status" IN ('active', 'inactive', 'archived'));
  END IF;
END $$;

-- Register migration
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1764000000000, 'CreateIndicators1764000000000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'CreateIndicators1764000000000');

COMMIT;

