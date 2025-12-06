import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('plan_rcas')
@Index(['planId'])
export class PlanRca extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  supportTicketNumber?: string; // Nro Support Ticket

  @Column({ type: 'varchar', length: 255, nullable: true })
  rcaNumber?: string; // Nro RCA

  @Column({ type: 'jsonb', default: '[]' })
  keyIssuesTags: string[]; // Tag Key issues

  @Column({ type: 'jsonb', default: '[]' })
  learningsTags: string[]; // Tag para Learnings

  @Column({ type: 'text', nullable: true })
  technicalDescription?: string; // Technical Description

  @Column({ type: 'text', nullable: true })
  referenceFileUrl?: string; // Link para adicionar el file de referencia

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => require('./plan.entity').Plan, (plan: any) => plan.rcas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  constructor(
    supportTicketNumber?: string,
    rcaNumber?: string,
    keyIssuesTags?: string[],
    learningsTags?: string[],
    technicalDescription?: string,
    referenceFileUrl?: string,
  ) {
    super();
    if (supportTicketNumber !== undefined) {
      this.supportTicketNumber = supportTicketNumber;
    }
    if (rcaNumber !== undefined) {
      this.rcaNumber = rcaNumber;
    }
    if (keyIssuesTags !== undefined) {
      this.keyIssuesTags = keyIssuesTags;
    } else {
      this.keyIssuesTags = [];
    }
    if (learningsTags !== undefined) {
      this.learningsTags = learningsTags;
    } else {
      this.learningsTags = [];
    }
    if (technicalDescription !== undefined) {
      this.technicalDescription = technicalDescription;
    }
    if (referenceFileUrl !== undefined) {
      this.referenceFileUrl = referenceFileUrl;
    }
  }

  validate(): void {
    // Basic validation - can be extended as needed
    if (this.keyIssuesTags && !Array.isArray(this.keyIssuesTags)) {
      throw new Error('Key issues tags must be an array');
    }
    if (this.learningsTags && !Array.isArray(this.learningsTags)) {
      throw new Error('Learnings tags must be an array');
    }
  }
}

