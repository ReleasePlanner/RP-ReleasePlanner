/**
 * Indicator Entity (TypeORM)
 * 
 * Represents a KPI or Indicator with ID, Name, Description, Formula (optional), and Status
 */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

export enum IndicatorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('indicators')
@Index(['name'], { unique: true })
export class Indicator extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  formula?: string;

  @Column({
    type: 'enum',
    enum: IndicatorStatus,
    default: IndicatorStatus.ACTIVE,
  })
  status: IndicatorStatus;

  constructor(
    name?: string,
    description?: string,
    formula?: string,
    status?: IndicatorStatus,
  ) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (formula !== undefined) {
      this.formula = formula;
    }
    if (status !== undefined) {
      this.status = status;
    } else {
      this.status = IndicatorStatus.ACTIVE;
    }
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Indicator name is required');
    }
    if (this.name.length > 255) {
      throw new Error('Indicator name must not exceed 255 characters');
    }
    if (!Object.values(IndicatorStatus).includes(this.status)) {
      throw new Error(`Invalid status. Must be one of: ${Object.values(IndicatorStatus).join(', ')}`);
    }
  }
}

