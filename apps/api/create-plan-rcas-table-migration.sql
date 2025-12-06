-- Migration: CreatePlanRcasTable
-- Description: Creates the plan_rcas table for storing Root Cause Analysis data

BEGIN;

-- Create the plan_rcas table
CREATE TABLE IF NOT EXISTS "plan_rcas" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "supportTicketNumber" VARCHAR(255) NULL,
  "rcaNumber" VARCHAR(255) NULL,
  "keyIssuesTags" JSONB NOT NULL DEFAULT '[]',
  "learningsTags" JSONB NOT NULL DEFAULT '[]',
  "technicalDescription" TEXT NULL,
  "referenceFileUrl" TEXT NULL,
  "planId" UUID NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_plan_rcas_plan" FOREIGN KEY ("planId") 
    REFERENCES "plans"("id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IDX_plan_rcas_planId" ON "plan_rcas"("planId");

-- Add comment to table
COMMENT ON TABLE "plan_rcas" IS 'Stores Root Cause Analysis data for release plans';

COMMIT;

