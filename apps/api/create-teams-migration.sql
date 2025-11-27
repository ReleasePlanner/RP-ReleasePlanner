-- Migration: CreateTeams
-- Description: Creates the teams and talents tables

BEGIN;

-- Create teams table
CREATE TABLE IF NOT EXISTS "teams" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT NULL,
  "type" VARCHAR(50) NOT NULL DEFAULT 'internal',
  CONSTRAINT "PK_teams" PRIMARY KEY ("id")
);

-- Create unique index on name
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_teams_name" ON "teams" ("name");

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS "IDX_teams_type" ON "teams" ("type");

-- Add check constraint for type enum values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'CHK_teams_type'
  ) THEN
    ALTER TABLE "teams" 
    ADD CONSTRAINT "CHK_teams_type" 
    CHECK ("type" IN ('internal', 'external', 'hybrid'));
  END IF;
END $$;

-- Create talents table
CREATE TABLE IF NOT EXISTS "talents" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NULL,
  "phone" VARCHAR(50) NULL,
  "role" VARCHAR(255) NULL,
  "teamId" uuid NOT NULL,
  CONSTRAINT "PK_talents" PRIMARY KEY ("id"),
  CONSTRAINT "FK_talents_team" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_talents_email" ON "talents" ("email") WHERE "email" IS NOT NULL;

-- Create index on teamId for faster lookups
CREATE INDEX IF NOT EXISTS "IDX_talents_teamId" ON "talents" ("teamId");

-- Register migration
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1765000000000, 'CreateTeams1765000000000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'CreateTeams1765000000000');

COMMIT;

