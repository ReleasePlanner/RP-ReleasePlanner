-- Migration: AddRescheduleTypesAndUpdateReschedules
-- Description: Creates reschedule_types table and adds rescheduleTypeId and ownerId to phase_reschedules

BEGIN;

-- Create reschedule_types table
CREATE TABLE IF NOT EXISTS "reschedule_types" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "name" varchar(255) NOT NULL,
  "description" varchar(500),
  CONSTRAINT "PK_reschedule_types" PRIMARY KEY ("id")
);

-- Add unique index for name
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_reschedule_types_name" ON "reschedule_types" ("name");

-- Add rescheduleTypeId column to phase_reschedules if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'phase_reschedules' AND column_name = 'rescheduleTypeId'
  ) THEN
    ALTER TABLE "phase_reschedules"
    ADD COLUMN "rescheduleTypeId" uuid NULL;
    
    RAISE NOTICE 'Column rescheduleTypeId added to phase_reschedules table';
  ELSE
    RAISE NOTICE 'Column rescheduleTypeId already exists in phase_reschedules table';
  END IF;
END $$;

-- Add ownerId column to phase_reschedules if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'phase_reschedules' AND column_name = 'ownerId'
  ) THEN
    ALTER TABLE "phase_reschedules"
    ADD COLUMN "ownerId" uuid NULL;
    
    RAISE NOTICE 'Column ownerId added to phase_reschedules table';
  ELSE
    RAISE NOTICE 'Column ownerId already exists in phase_reschedules table';
  END IF;
END $$;

-- Add indexes for rescheduleTypeId and ownerId
CREATE INDEX IF NOT EXISTS "IDX_phase_reschedules_rescheduleTypeId" ON "phase_reschedules" ("rescheduleTypeId");
CREATE INDEX IF NOT EXISTS "IDX_phase_reschedules_ownerId" ON "phase_reschedules" ("ownerId");

-- Add foreign key constraint to reschedule_types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'FK_phase_reschedules_reschedule_type'
  ) THEN
    ALTER TABLE "phase_reschedules"
    ADD CONSTRAINT "FK_phase_reschedules_reschedule_type"
    FOREIGN KEY ("rescheduleTypeId") REFERENCES "reschedule_types"("id") ON DELETE SET NULL;
    
    RAISE NOTICE 'Foreign key constraint FK_phase_reschedules_reschedule_type added';
  ELSE
    RAISE NOTICE 'Foreign key constraint FK_phase_reschedules_reschedule_type already exists';
  END IF;
END $$;

-- Add foreign key constraint to owners
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'FK_phase_reschedules_owner'
  ) THEN
    ALTER TABLE "phase_reschedules"
    ADD CONSTRAINT "FK_phase_reschedules_owner"
    FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE SET NULL;
    
    RAISE NOTICE 'Foreign key constraint FK_phase_reschedules_owner added';
  ELSE
    RAISE NOTICE 'Foreign key constraint FK_phase_reschedules_owner already exists';
  END IF;
END $$;

-- Insert default reschedule types
INSERT INTO "reschedule_types" ("id", "name", "description")
VALUES 
  (uuid_generate_v4(), 'Scope Change', 'Change due to scope modification'),
  (uuid_generate_v4(), 'Resource Availability', 'Change due to resource availability issues'),
  (uuid_generate_v4(), 'Dependency Delay', 'Change due to dependency delays'),
  (uuid_generate_v4(), 'Priority Shift', 'Change due to priority shift'),
  (uuid_generate_v4(), 'Risk Mitigation', 'Change due to risk mitigation'),
  (uuid_generate_v4(), 'Client Request', 'Change requested by client'),
  (uuid_generate_v4(), 'Technical Issue', 'Change due to technical issues'),
  (uuid_generate_v4(), 'Other', 'Other reason for reschedule')
ON CONFLICT ("name") DO NOTHING;

COMMIT;

