import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveGanttTables1764000008000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order of dependencies
    await queryRunner.query(`DROP TABLE IF EXISTS gantt_cell_comments CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS gantt_cell_files CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS gantt_cell_links CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS gantt_cell_data CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate gantt_cell_data table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gantt_cell_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "phaseId" UUID,
        date DATE NOT NULL,
        "isMilestone" BOOLEAN DEFAULT FALSE,
        "milestoneColor" VARCHAR(7),
        "planId" UUID NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_gantt_cell_data_plan 
          FOREIGN KEY ("planId") REFERENCES plans(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_gantt_cell_data_plan_date 
      ON gantt_cell_data("planId", date);
    `);

    // Recreate gantt_cell_comments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gantt_cell_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        "cellDataId" UUID NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_gantt_cell_comments_cell_data 
          FOREIGN KEY ("cellDataId") REFERENCES gantt_cell_data(id) ON DELETE CASCADE
      );
    `);

    // Recreate gantt_cell_files table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gantt_cell_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        size BIGINT,
        "mimeType" VARCHAR(100),
        "cellDataId" UUID NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_gantt_cell_files_cell_data 
          FOREIGN KEY ("cellDataId") REFERENCES gantt_cell_data(id) ON DELETE CASCADE
      );
    `);

    // Recreate gantt_cell_links table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gantt_cell_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        "cellDataId" UUID NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_gantt_cell_links_cell_data 
          FOREIGN KEY ("cellDataId") REFERENCES gantt_cell_data(id) ON DELETE CASCADE
      );
    `);
  }
}

