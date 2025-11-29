-- Migration: Add leadId column to plans table
-- This column stores the ID of the lead talent assigned to a plan

-- Add leadId column if it doesn't exist
ALTER TABLE "plans" 
ADD COLUMN IF NOT EXISTS "leadId" VARCHAR(255) NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "IDX_plans_leadId" ON "plans" ("leadId");

-- Add comment to column
COMMENT ON COLUMN "plans"."leadId" IS 'ID of the lead talent assigned to this plan';

