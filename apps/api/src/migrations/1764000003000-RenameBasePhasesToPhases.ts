import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBasePhasesToPhases1764000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename table
    await queryRunner.query(`ALTER TABLE base_phases RENAME TO phases;`);
    
    // Rename indexes
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_base_phases_name RENAME TO idx_phases_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_base_phases_name" RENAME TO "IDX_phases_name";`);
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_base_phases_color RENAME TO idx_phases_color;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_base_phases_color" RENAME TO "IDX_phases_color";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE phases RENAME TO base_phases;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_phases_name RENAME TO idx_base_phases_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_phases_name" RENAME TO "IDX_base_phases_name";`);
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_phases_color RENAME TO idx_base_phases_color;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_phases_color" RENAME TO "IDX_base_phases_color";`);
  }
}

