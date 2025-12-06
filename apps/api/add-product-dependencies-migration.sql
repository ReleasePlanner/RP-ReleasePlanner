-- Migration: AddProductDependencies
-- Description: Creates product_dependencies table to track product dependencies (satellite products)

BEGIN;

-- Create product_dependencies table
CREATE TABLE IF NOT EXISTS "product_dependencies" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "productId" uuid NOT NULL,
  "dependencyProductId" uuid NOT NULL,
  "ownerId" uuid NULL,
  "technicalLeadId" uuid NULL,
  CONSTRAINT "PK_product_dependencies" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "IDX_product_dependencies_productId" ON "product_dependencies" ("productId");
CREATE INDEX IF NOT EXISTS "IDX_product_dependencies_dependencyProductId" ON "product_dependencies" ("dependencyProductId");
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_dependencies_unique" ON "product_dependencies" ("productId", "dependencyProductId");

-- Add foreign key constraints
DO $$
BEGIN
  -- FK to products (main product)
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'FK_product_dependencies_product'
  ) THEN
    ALTER TABLE "product_dependencies"
    ADD CONSTRAINT "FK_product_dependencies_product"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE;
    
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_product added';
  ELSE
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_product already exists';
  END IF;

  -- FK to products (dependency product)
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'FK_product_dependencies_dependency_product'
  ) THEN
    ALTER TABLE "product_dependencies"
    ADD CONSTRAINT "FK_product_dependencies_dependency_product"
    FOREIGN KEY ("dependencyProductId") REFERENCES "products"("id") ON DELETE CASCADE;
    
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_dependency_product added';
  ELSE
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_dependency_product already exists';
  END IF;

  -- FK to owners
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'FK_product_dependencies_owner'
  ) THEN
    ALTER TABLE "product_dependencies"
    ADD CONSTRAINT "FK_product_dependencies_owner"
    FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE SET NULL;
    
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_owner added';
  ELSE
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_owner already exists';
  END IF;

  -- FK to talents (technical lead)
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'FK_product_dependencies_technical_lead'
  ) THEN
    ALTER TABLE "product_dependencies"
    ADD CONSTRAINT "FK_product_dependencies_technical_lead"
    FOREIGN KEY ("technicalLeadId") REFERENCES "talents"("id") ON DELETE SET NULL;
    
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_technical_lead added';
  ELSE
    RAISE NOTICE 'Foreign key constraint FK_product_dependencies_technical_lead already exists';
  END IF;
END $$;

COMMIT;

