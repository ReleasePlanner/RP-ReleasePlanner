import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOwnerTypes1764000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create owner_types table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS owner_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_owner_type_name CHECK (name IN ('IT', 'PO'))
      );
    `);

    // Create index
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_owner_types_name ON owner_types(name);
    `);

    // Insert default owner types (only if they don't exist)
    await queryRunner.query(`
      INSERT INTO owner_types (id, name)
      SELECT gen_random_uuid(), 'IT'
      WHERE NOT EXISTS (SELECT 1 FROM owner_types WHERE name = 'IT');
    `);
    
    await queryRunner.query(`
      INSERT INTO owner_types (id, name)
      SELECT gen_random_uuid(), 'PO'
      WHERE NOT EXISTS (SELECT 1 FROM owner_types WHERE name = 'PO');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS owner_types CASCADE;`);
  }
}

