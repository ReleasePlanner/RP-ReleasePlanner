import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePlanReferencesTable1764000007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to plan_references table
    await queryRunner.query(`
      ALTER TABLE plan_references 
      ADD COLUMN IF NOT EXISTS "planReferenceTypeId" UUID,
      ADD COLUMN IF NOT EXISTS "periodDay" DATE,
      ADD COLUMN IF NOT EXISTS "calendarDayId" UUID;
    `);

    // Create foreign key to plan_reference_type
    await queryRunner.query(`
      ALTER TABLE plan_references 
      ADD CONSTRAINT fk_plan_references_reference_type 
      FOREIGN KEY ("planReferenceTypeId") REFERENCES plan_reference_type(id) ON DELETE RESTRICT;
    `);

    // Create foreign key to calendar_days (if calendarDayId is set)
    await queryRunner.query(`
      ALTER TABLE plan_references 
      ADD CONSTRAINT fk_plan_references_calendar_day 
      FOREIGN KEY ("calendarDayId") REFERENCES calendar_days(id) ON DELETE CASCADE;
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_references_reference_type_id 
      ON plan_references("planReferenceTypeId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_references_period_day 
      ON plan_references("periodDay");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_references_calendar_day_id 
      ON plan_references("calendarDayId");
    `);

    // Migrate existing data: Set default reference type to 'plan' for existing records
    // First, get the 'plan' type ID
    const planTypeResult = await queryRunner.query(`
      SELECT id FROM plan_reference_type WHERE name = 'plan' LIMIT 1;
    `);

    if (planTypeResult && planTypeResult.length > 0) {
      const planTypeId = planTypeResult[0].id;
      
      // Update existing references to have 'plan' type
      await queryRunner.query(`
        UPDATE plan_references 
        SET "planReferenceTypeId" = $1 
        WHERE "planReferenceTypeId" IS NULL;
      `, [planTypeId]);
    }

    // Make planReferenceTypeId NOT NULL after migration
    await queryRunner.query(`
      ALTER TABLE plan_references 
      ALTER COLUMN "planReferenceTypeId" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign keys
    await queryRunner.query(`
      ALTER TABLE plan_references 
      DROP CONSTRAINT IF EXISTS fk_plan_references_calendar_day;
    `);

    await queryRunner.query(`
      ALTER TABLE plan_references 
      DROP CONSTRAINT IF EXISTS fk_plan_references_reference_type;
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_plan_references_calendar_day_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_plan_references_period_day;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_plan_references_reference_type_id;`);

    // Remove columns
    await queryRunner.query(`
      ALTER TABLE plan_references 
      DROP COLUMN IF EXISTS "calendarDayId",
      DROP COLUMN IF EXISTS "periodDay",
      DROP COLUMN IF EXISTS "planReferenceTypeId";
    `);
  }
}

