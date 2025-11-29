/**
 * Release Plans API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface PlanPhase {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  metricValues?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface PlanTask {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhaseReschedule {
  id: string;
  planPhaseId: string;
  phaseName: string;
  rescheduledAt: string;
  originalStartDate?: string;
  originalEndDate?: string;
  newStartDate?: string;
  newEndDate?: string;
  rescheduleTypeId?: string;
  rescheduleTypeName?: string;
  ownerId?: string;
  ownerName?: string;
}

export interface PlanMilestone {
  id: string;
  date: string;
  name: string;
  description?: string;
  phaseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanReferenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

export interface PlanReference {
  id: string;
  type: 'link' | 'document' | 'note' | 'milestone'; // Content type
  title: string;
  url?: string;
  description?: string;
  planReferenceTypeId?: string; // Reference level: plan, period, day
  planReferenceType?: { id: string; name: 'plan' | 'period' | 'day' };
  periodDay?: string; // For 'period' type: specific day within the period
  calendarDayId?: string; // For 'day' type: specific calendar day
  calendarDay?: { id: string; name: string; date: string; type: string };
  phaseId?: string; // For 'day' type: phase associated with the day
  date?: string; // Legacy field - deprecated, use periodDay or calendarDayId
  milestoneColor?: string;
  files?: PlanReferenceFile[];
  createdAt: string;
  updatedAt: string;
}

// Note: GanttCellData, GanttCellComment, GanttCellFile, GanttCellLink have been removed
// References (comments, files, links) are now handled via plan_references table

export interface Plan {
  id: string;
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  phases?: PlanPhase[];
  productId?: string;
  itOwner?: string;
  leadId?: string;
  featureIds: string[];
  components: Array<{ componentId: string; currentVersion: string; finalVersion: string }>;
  calendarIds: string[];
  indicatorIds: string[]; // IDs of indicators/KPIs associated with this plan
  milestones?: PlanMilestone[];
  references?: PlanReference[];
  tasks?: PlanTask[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPhaseDto {
  name: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  metricValues?: Record<string, string>;
}

export interface CreatePlanDto {
  name: string;
  // Removed: owner field - use itOwner field instead and join with owners table
  startDate: string;
  endDate: string;
  status?: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  phases?: CreatePlanPhaseDto[];
  productId: string; // Required
  itOwner?: string;
  leadId?: string;
  featureIds?: string[];
  calendarIds?: string[];
}

export interface UpdatePlanPhaseDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  metricValues?: Record<string, string>;
}

export interface UpdatePlanTaskDto {
  title?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
}

export interface UpdatePlanMilestoneDto {
  name?: string;
  date?: string;
  description?: string;
}

// Note: UpdateGanttCellCommentDto, UpdateGanttCellFileDto, UpdateGanttCellLinkDto, UpdateGanttCellDataDto have been removed
// References (comments, files, links) are now handled via plan_references table

export interface UpdatePlanReferenceDto {
  type?: 'link' | 'document' | 'note' | 'milestone'; // Content type
  title?: string;
  url?: string;
  description?: string;
  planReferenceTypeId?: string; // Reference level: plan, period, day
  periodDay?: string; // For 'period' type: specific day within the period
  calendarDayId?: string; // For 'day' type: specific calendar day
  phaseId?: string; // For 'day' type: phase associated with the day
  date?: string; // Legacy field - deprecated, use periodDay or calendarDayId
  milestoneColor?: string;
  files?: PlanReferenceFile[]; // For document type
}

export interface UpdatePlanDto {
  name?: string;
  // Removed: owner field - use itOwner field instead and join with owners table
  startDate?: string;
  endDate?: string;
  status?: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  phases?: UpdatePlanPhaseDto[];
  tasks?: UpdatePlanTaskDto[];
  milestones?: UpdatePlanMilestoneDto[];
  references?: UpdatePlanReferenceDto[];
  // Note: cellData has been removed - references are now handled via plan_references table
  productId?: string;
  itOwner?: string;
  leadId?: string;
  featureIds?: string[];
  calendarIds?: string[];
  indicatorIds?: string[]; // IDs of indicators/KPIs associated with this plan
  components?: Array<{ componentId: string; currentVersion: string; finalVersion: string }>;
  updatedAt?: string; // For optimistic locking
}

export const plansService = {
  async getAll(): Promise<Plan[]> {
    return httpClient.get<Plan[]>(API_ENDPOINTS.PLANS);
  },

  async getById(id: string): Promise<Plan> {
    return httpClient.get<Plan>(`${API_ENDPOINTS.PLANS}/${id}`);
  },

  async create(data: CreatePlanDto): Promise<Plan> {
    return httpClient.post<Plan>(API_ENDPOINTS.PLANS, data);
  },

  async update(id: string, data: UpdatePlanDto): Promise<Plan> {
    return httpClient.put<Plan>(`${API_ENDPOINTS.PLANS}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.PLANS}/${id}`);
  },

  async getPlanReschedules(planId: string): Promise<PhaseReschedule[]> {
    return httpClient.get<PhaseReschedule[]>(`${API_ENDPOINTS.PLANS}/${planId}/reschedules`);
  },

  async getPhaseReschedules(planId: string, phaseId: string): Promise<PhaseReschedule[]> {
    return httpClient.get<PhaseReschedule[]>(`${API_ENDPOINTS.PLANS}/${planId}/phases/${phaseId}/reschedules`);
  },

  async updateReschedule(rescheduleId: string, data: { rescheduleTypeId?: string; ownerId?: string }): Promise<PhaseReschedule> {
    return httpClient.put<PhaseReschedule>(`${API_ENDPOINTS.PLANS}/reschedules/${rescheduleId}/update`, data);
  },
};

