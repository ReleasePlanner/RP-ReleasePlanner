import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMetricValuesToPlanPhases1764000009000 implements MigrationInterface {
  name = 'AddMetricValuesToPlanPhases1764000009000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add metricValues column to plan_phases table
    await queryRunner.addColumn(
      'plan_phases',
      new TableColumn({
        name: 'metricValues',
        type: 'jsonb',
        default: "'{}'",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove metricValues column
    await queryRunner.dropColumn('plan_phases', 'metricValues');
  }
}

