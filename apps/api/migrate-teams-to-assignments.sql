-- Migration: Convert Teams-Talents relationship to Many-to-Many with allocation percentages
-- This migration:
-- 1. Creates the team_talent_assignments junction table
-- 2. Migrates existing data from talents.teamId to assignments
-- 3. Drops the teamId column from talents table

BEGIN;

-- Step 1: Create the team_talent_assignments table
CREATE TABLE IF NOT EXISTS team_talent_assignments (
    "teamId" UUID NOT NULL,
    "talentId" UUID NOT NULL,
    "allocationPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("teamId", "talentId"),
    CONSTRAINT "FK_team_talent_assignments_team" FOREIGN KEY ("teamId") 
        REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT "FK_team_talent_assignments_talent" FOREIGN KEY ("talentId") 
        REFERENCES talents(id) ON DELETE CASCADE,
    CONSTRAINT "CHK_allocation_percentage" CHECK ("allocationPercentage" >= 0 AND "allocationPercentage" <= 100)
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS "IDX_team_talent_assignments_teamId" ON team_talent_assignments("teamId");
CREATE INDEX IF NOT EXISTS "IDX_team_talent_assignments_talentId" ON team_talent_assignments("talentId");
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_team_talent_assignments_unique" ON team_talent_assignments("teamId", "talentId");

-- Step 3: Migrate existing data
-- For each talent with a teamId, create an assignment with 100% allocation
INSERT INTO team_talent_assignments ("teamId", "talentId", "allocationPercentage", "createdAt", "updatedAt")
SELECT 
    "teamId",
    id as "talentId",
    100.00 as "allocationPercentage",
    "createdAt",
    "updatedAt"
FROM talents
WHERE "teamId" IS NOT NULL
ON CONFLICT ("teamId", "talentId") DO NOTHING;

-- Step 4: Drop the old teamId column and its index
DROP INDEX IF EXISTS "IDX_talents_teamId";
ALTER TABLE talents DROP COLUMN IF EXISTS "teamId";

COMMIT;

