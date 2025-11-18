import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { PlanReferenceType } from './plan-reference-type.entity';

// Reference content types (what the reference contains)
export enum PlanReferenceContentType {
  LINK = 'link',
  DOCUMENT = 'document',
  NOTE = 'note',
  COMMENT = 'comment',
  FILE = 'file',
  MILESTONE = 'milestone',
}

@Entity('plan_references')
@Index(['planId'])
@Index(['planReferenceTypeId'])
@Index(['periodDay'])
@Index(['calendarDayId'])
export class PlanReference extends BaseEntity {
  // Content type: what kind of reference (link, document, note, comment, file, milestone)
  @Column({ type: 'enum', enum: PlanReferenceContentType })
  type: PlanReferenceContentType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  url?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Reference level: where the reference is attached (plan, period, day)
  @Column({ type: 'uuid' })
  planReferenceTypeId: string;

  @ManyToOne(() => PlanReferenceType, { eager: false, nullable: false })
  @JoinColumn({ name: 'planReferenceTypeId' })
  planReferenceType?: PlanReferenceType;

  // For 'period' type: specific day within the period
  @Column({ type: 'date', nullable: true })
  periodDay?: string; // ISO date (YYYY-MM-DD)

  // For 'day' type: specific calendar day and phase
  @Column({ type: 'uuid', nullable: true })
  calendarDayId?: string;

  @ManyToOne(() => require('../../calendars/domain/calendar-day.entity').CalendarDay, { eager: false, nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'calendarDayId' })
  calendarDay?: any;

  // For 'day' type: phase associated with the day
  @Column({ type: 'uuid', nullable: true })
  phaseId?: string;

  // Legacy fields (kept for backward compatibility)
  @Column({ type: 'date', nullable: true })
  date?: string; // ISO date (YYYY-MM-DD) - deprecated, use periodDay or calendarDayId

  @Column({ type: 'varchar', length: 7, nullable: true })
  milestoneColor?: string; // Color for milestone type references

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => require('../../release-plans/domain/plan.entity').Plan, (plan: any) => plan.references, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  constructor(
    type?: PlanReferenceContentType,
    title?: string,
    url?: string,
    description?: string,
    planReferenceTypeId?: string,
    periodDay?: string,
    calendarDayId?: string,
    phaseId?: string,
    date?: string, // Legacy parameter
    milestoneColor?: string,
  ) {
    super();
    if (type !== undefined) {
      this.type = type;
    }
    if (title !== undefined) {
      this.title = title;
    }
    if (url !== undefined) {
      this.url = url;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (planReferenceTypeId !== undefined) {
      this.planReferenceTypeId = planReferenceTypeId;
    }
    if (periodDay !== undefined) {
      this.periodDay = periodDay;
    }
    if (calendarDayId !== undefined) {
      this.calendarDayId = calendarDayId;
    }
    if (phaseId !== undefined) {
      this.phaseId = phaseId;
    }
    // Legacy date field
    if (date !== undefined) {
      this.date = date;
    }
    if (milestoneColor !== undefined) {
      this.milestoneColor = milestoneColor;
    }
    if (type !== undefined && title !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!Object.values(PlanReferenceContentType).includes(this.type)) {
      throw new Error(`Invalid reference content type: ${this.type}`);
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Reference title is required');
    }
    if (!this.planReferenceTypeId) {
      throw new Error('Plan reference type is required');
    }
    if (
      (this.type === PlanReferenceContentType.LINK || this.type === PlanReferenceContentType.DOCUMENT) &&
      (!this.url || this.url.trim().length === 0)
    ) {
      throw new Error('URL is required for link and document types');
    }
    // Validate period day if set
    if (this.periodDay && !this.isValidDate(this.periodDay)) {
      throw new Error('Valid period day in YYYY-MM-DD format is required');
    }
    // Validate legacy date field if set
    if (this.date && !this.isValidDate(this.date)) {
      throw new Error('Valid date in YYYY-MM-DD format is required');
    }
  }

  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      return false;
    }
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }
}
