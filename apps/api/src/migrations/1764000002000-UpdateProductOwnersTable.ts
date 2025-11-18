import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductOwnersTable1764000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if product_owners table exists and has the old structure
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_owners'
      );
    `);

    if (tableExists[0]?.exists) {
      // Check current structure
      const columns = await queryRunner.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'product_owners';
      `);

      const hasNameColumn = columns.some((col: any) => col.column_name === 'name');
      const hasOwnerIdColumn = columns.some((col: any) => col.column_name === 'ownerId');
      const hasOwnerTypeIdColumn = columns.some((col: any) => col.column_name === 'ownerTypeId');

      if (hasNameColumn && !hasOwnerIdColumn) {
        // Old structure - migrate to new structure
        // First, add new columns
        await queryRunner.query(`
          ALTER TABLE product_owners 
          ADD COLUMN IF NOT EXISTS "ownerId" UUID,
          ADD COLUMN IF NOT EXISTS "ownerTypeId" UUID;
        `);

        // Create foreign keys (only if they don't exist)
        await queryRunner.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'fk_product_owners_owner'
            ) THEN
              ALTER TABLE product_owners 
              ADD CONSTRAINT fk_product_owners_owner 
              FOREIGN KEY ("ownerId") REFERENCES owners(id) ON DELETE CASCADE;
            END IF;
          END $$;
        `);

        await queryRunner.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'fk_product_owners_owner_type'
            ) THEN
              ALTER TABLE product_owners 
              ADD CONSTRAINT fk_product_owners_owner_type 
              FOREIGN KEY ("ownerTypeId") REFERENCES owner_types(id) ON DELETE RESTRICT;
            END IF;
          END $$;
        `);

        // Create indexes
        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS idx_product_owners_owner_id ON product_owners("ownerId");
        `);

        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS idx_product_owners_owner_type_id ON product_owners("ownerTypeId");
        `);

        // Note: We keep the 'name' column for backward compatibility during migration
        // It can be removed in a later migration after data migration is complete
      } else if (!hasOwnerIdColumn) {
        // Table exists but doesn't have the new structure - add columns
        await queryRunner.query(`
          ALTER TABLE product_owners 
          ADD COLUMN IF NOT EXISTS "ownerId" UUID,
          ADD COLUMN IF NOT EXISTS "ownerTypeId" UUID;
        `);

        await queryRunner.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'fk_product_owners_owner'
            ) THEN
              ALTER TABLE product_owners 
              ADD CONSTRAINT fk_product_owners_owner 
              FOREIGN KEY ("ownerId") REFERENCES owners(id) ON DELETE CASCADE;
            END IF;
          END $$;
        `);

        await queryRunner.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = 'fk_product_owners_owner_type'
            ) THEN
              ALTER TABLE product_owners 
              ADD CONSTRAINT fk_product_owners_owner_type 
              FOREIGN KEY ("ownerTypeId") REFERENCES owner_types(id) ON DELETE RESTRICT;
            END IF;
          END $$;
        `);

        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS idx_product_owners_owner_id ON product_owners("ownerId");
        `);

        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS idx_product_owners_owner_type_id ON product_owners("ownerTypeId");
        `);
      }
    } else {
      // Create new table structure
      // Table doesn't exist - create it with new structure
      // Note: This migration assumes product_owners table will be created separately
      // or that it already exists. We only add the new columns here.
      // If table doesn't exist, it should be created by another migration or manually.
      console.log('Note: product_owners table structure update - table may need to be created separately');

      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_product_owners_owner_id ON product_owners("ownerId");
      `);

      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_product_owners_owner_type_id ON product_owners("ownerTypeId");
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign keys and columns
    await queryRunner.query(`
      ALTER TABLE product_owners 
      DROP CONSTRAINT IF EXISTS fk_product_owners_owner_type;
    `);

    await queryRunner.query(`
      ALTER TABLE product_owners 
      DROP CONSTRAINT IF EXISTS fk_product_owners_owner;
    `);

    await queryRunner.query(`
      ALTER TABLE product_owners 
      DROP COLUMN IF EXISTS "ownerTypeId",
      DROP COLUMN IF EXISTS "ownerId";
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_product_owners_owner_type_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_product_owners_owner_id;`);
  }
}

