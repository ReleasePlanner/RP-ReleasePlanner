import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameItOwnersToOwners1764000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename table
    await queryRunner.query(`ALTER TABLE it_owners RENAME TO owners;`);
    
    // Rename indexes
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_it_owners_name RENAME TO idx_owners_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_it_owners_name" RENAME TO "IDX_owners_name";`);
    
    // Update foreign key references in plans table
    // Note: The itOwner column in plans is VARCHAR, so we don't need to update FK constraints
    // But we should update any views or functions that reference it_owners
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE owners RENAME TO it_owners;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_owners_name RENAME TO idx_it_owners_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_owners_name" RENAME TO "IDX_it_owners_name";`);
  }
}

