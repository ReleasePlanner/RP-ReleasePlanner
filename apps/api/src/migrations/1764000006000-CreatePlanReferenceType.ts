import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlanReferenceType1764000006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create plan_reference_type table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS plan_reference_type (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_plan_reference_type_name CHECK (name IN ('plan', 'period', 'day'))
      );
    `);

    // Create index
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_reference_type_name ON plan_reference_type(name);
    `);

    // Insert default reference types
    await queryRunner.query(`
      INSERT INTO plan_reference_type (id, name) VALUES
      (gen_random_uuid(), 'plan'),
      (gen_random_uuid(), 'period'),
      (gen_random_uuid(), 'day')
      ON CONFLICT (name) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS plan_reference_type CASCADE;`);
  }
}

