import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('phase_reschedules')
@Index(['planPhaseId'])
@Index(['rescheduledAt'])
@Index(['rescheduleTypeId'])
@Index(['ownerId'])
export class PhaseReschedule extends BaseEntity {
  @Column({ type: 'uuid' })
  planPhaseId: string;

  @ManyToOne(() => require('./plan-phase.entity').PlanPhase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planPhaseId' })
  planPhase: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rescheduledAt: Date;

  @Column({ type: 'date', nullable: true })
  originalStartDate?: string;

  @Column({ type: 'date', nullable: true })
  originalEndDate?: string;

  @Column({ type: 'date', nullable: true })
  newStartDate?: string;

  @Column({ type: 'date', nullable: true })
  newEndDate?: string;

  @Column({ type: 'uuid', nullable: true })
  rescheduleTypeId?: string;

  @ManyToOne(() => require('../../reschedule-types/domain/reschedule-type.entity').RescheduleType, { nullable: true })
  @JoinColumn({ name: 'rescheduleTypeId' })
  rescheduleType?: any;

  @Column({ type: 'uuid', nullable: true })
  ownerId?: string;

  @ManyToOne(() => require('../../owners/domain/owner.entity').Owner, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner?: any;

  constructor(
    planPhaseId?: string,
    originalStartDate?: string,
    originalEndDate?: string,
    newStartDate?: string,
    newEndDate?: string,
    rescheduleTypeId?: string,
    ownerId?: string
  ) {
    super();
    if (planPhaseId !== undefined) {
      this.planPhaseId = planPhaseId;
    }
    if (originalStartDate !== undefined) {
      this.originalStartDate = originalStartDate;
    }
    if (originalEndDate !== undefined) {
      this.originalEndDate = originalEndDate;
    }
    if (newStartDate !== undefined) {
      this.newStartDate = newStartDate;
    }
    if (newEndDate !== undefined) {
      this.newEndDate = newEndDate;
    }
    if (rescheduleTypeId !== undefined) {
      this.rescheduleTypeId = rescheduleTypeId;
    }
    if (ownerId !== undefined) {
      this.ownerId = ownerId;
    }
    this.rescheduledAt = new Date();
  }
}

