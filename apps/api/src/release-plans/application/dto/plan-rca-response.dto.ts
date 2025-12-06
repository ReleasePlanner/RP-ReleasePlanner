import { PlanRca } from "../../domain/plan-rca.entity";

export class PlanRcaResponseDto {
  id: string;
  supportTicketNumber?: string;
  rcaNumber?: string;
  keyIssuesTags: string[];
  learningsTags: string[];
  technicalDescription?: string;
  referenceFileUrl?: string;
  planId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanRca) {
    this.id = entity.id;
    this.supportTicketNumber = entity.supportTicketNumber;
    this.rcaNumber = entity.rcaNumber;
    this.keyIssuesTags = entity.keyIssuesTags || [];
    this.learningsTags = entity.learningsTags || [];
    this.technicalDescription = entity.technicalDescription;
    this.referenceFileUrl = entity.referenceFileUrl;
    this.planId = entity.planId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

