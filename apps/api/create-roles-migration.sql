-- Migration: CreateRoles
-- Description: Creates the roles table and updates talents table to use roleId foreign key

BEGIN;

-- Create roles table
CREATE TABLE IF NOT EXISTS "roles" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "name" VARCHAR(255) NOT NULL,
  CONSTRAINT "PK_roles" PRIMARY KEY ("id")
);

-- Create unique index on name
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_roles_name" ON "roles" ("name");

-- Add roleId column to talents table (nullable initially)
ALTER TABLE "talents" ADD COLUMN IF NOT EXISTS "roleId" uuid NULL;

-- Create index on roleId for faster lookups
CREATE INDEX IF NOT EXISTS "IDX_talents_roleId" ON "talents" ("roleId");

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'FK_talents_role'
  ) THEN
    ALTER TABLE "talents" 
    ADD CONSTRAINT "FK_talents_role" 
    FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL;
  END IF;
END $$;

-- Remove old role column if it exists (it was a varchar)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'talents' AND column_name = 'role' AND data_type = 'character varying'
  ) THEN
    ALTER TABLE "talents" DROP COLUMN "role";
  END IF;
END $$;

-- Register migration
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1765000001000, 'CreateRoles1765000001000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'CreateRoles1765000001000');

COMMIT;

