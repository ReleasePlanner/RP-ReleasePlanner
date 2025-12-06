import { Plan, PlanStatus, ReleaseStatus } from '../../domain/plan.entity';
import { PlanPhase } from '../../domain/plan-phase.entity';
import { PlanTask } from '../../domain/plan-task.entity';
import { PlanMilestone } from '../../domain/plan-milestone.entity';
import { PlanReference } from '../../domain/plan-reference.entity';

export class PlanPhaseResponseDto {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  metricValues: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanPhase) {
    this.id = entity.id;
    this.name = entity.name;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.color = entity.color;
    this.metricValues = entity.metricValues || {};
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanTaskResponseDto {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanTask) {
    this.id = entity.id;
    this.title = entity.title;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.color = entity.color;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanMilestoneResponseDto {
  id: string;
  date: string;
  name: string;
  description?: string;
  phaseId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanMilestone) {
    this.id = entity.id;
    this.date = entity.date;
    this.name = entity.name;
    this.description = entity.description;
    this.phaseId = entity.phaseId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanReferenceResponseDto {
  id: string;
  type: string; // Content type: link, document, note, comment, file, milestone
  title: string;
  url?: string;
  description?: string;
  planReferenceTypeId: string; // Reference level: plan, period, day
  planReferenceType?: { id: string; name: string }; // Reference type details
  periodDay?: string; // For 'period' type: specific day within the period
  calendarDayId?: string; // For 'day' type: specific calendar day
  calendarDay?: { id: string; name: string; date: string; type: string }; // Calendar day details
  phaseId?: string; // For 'day' type: phase associated with the day
  date?: string; // Legacy field - deprecated, use periodDay or calendarDayId
  milestoneColor?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanReference) {
    this.id = entity.id;
    this.type = entity.type;
    this.title = entity.title;
    this.url = entity.url;
    this.description = entity.description;
    this.planReferenceTypeId = entity.planReferenceTypeId;
    this.planReferenceType = entity.planReferenceType ? {
      id: entity.planReferenceType.id,
      name: entity.planReferenceType.name,
    } : undefined;
    this.periodDay = entity.periodDay;
    this.calendarDayId = entity.calendarDayId;
    this.calendarDay = entity.calendarDay ? {
      id: entity.calendarDay.id,
      name: entity.calendarDay.name,
      date: entity.calendarDay.date,
      type: entity.calendarDay.type,
    } : undefined;
    this.phaseId = entity.phaseId;
    this.date = entity.date; // Legacy field
    this.milestoneColor = entity.milestoneColor;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanResponseDto {
  id: string;
  name: string;
  owner: string; // Owner name from it_owners table (via JOIN)
  startDate: string;
  endDate: string;
  status: PlanStatus;
  releaseStatus?: ReleaseStatus;
  description?: string;
  phases: PlanPhaseResponseDto[];
  productId?: string;
  itOwner?: string;
  leadId?: string;
  featureIds: string[];
  components: Array<{ componentId: string; currentVersion: string; finalVersion: string }>;
  calendarIds: string[];
  indicatorIds: string[];
  teamIds: string[];
  milestones: PlanMilestoneResponseDto[];
  references: PlanReferenceResponseDto[];
  tasks: PlanTaskResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Plan & { ownerName?: string }) {
    this.id = entity.id;
    this.name = entity.name;
    // Use ownerName from JOIN with it_owners table, fallback to empty string if not available
    this.owner = (entity as any).ownerName || '';
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.status = entity.status;
    this.releaseStatus = entity.releaseStatus;
    this.description = entity.description;
    // Defensive: Handle undefined/null relations
    this.phases = (entity.phases && Array.isArray(entity.phases)) 
      ? entity.phases.map((p) => new PlanPhaseResponseDto(p))
      : [];
    this.productId = entity.productId;
    this.itOwner = entity.itOwner;
    this.leadId = entity.leadId;
    this.featureIds = entity.featureIds || [];
    this.components = entity.components || [];
    this.calendarIds = entity.calendarIds || [];
    this.indicatorIds = entity.indicatorIds || [];
    this.teamIds = entity.teamIds || [];
    this.milestones = (entity.milestones && Array.isArray(entity.milestones))
      ? entity.milestones.map((m) => new PlanMilestoneResponseDto(m))
      : [];
    this.references = (entity.references && Array.isArray(entity.references))
      ? entity.references.map((r) => new PlanReferenceResponseDto(r))
      : [];
    this.tasks = (entity.tasks && Array.isArray(entity.tasks))
      ? entity.tasks.map((t) => new PlanTaskResponseDto(t))
      : [];
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

