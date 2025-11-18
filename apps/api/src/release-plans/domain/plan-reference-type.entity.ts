/**
 * Plan Reference Type Entity (TypeORM)
 */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

export enum PlanReferenceTypeName {
  PLAN = 'plan',
  PERIOD = 'period',
  DAY = 'day',
}

@Entity('plan_reference_type')
@Index(['name'], { unique: true })
export class PlanReferenceType extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: PlanReferenceTypeName;

  constructor(name?: PlanReferenceTypeName) {
    super();
    if (name !== undefined) {
      this.name = name;
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || !Object.values(PlanReferenceTypeName).includes(this.name)) {
      throw new Error(`Invalid plan reference type: ${this.name}. Must be 'plan', 'period', or 'day'`);
    }
  }
}

