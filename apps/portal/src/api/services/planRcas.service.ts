/**
 * Plan RCAs API Service
 */
import { httpClient } from "../httpClient";
import { API_ENDPOINTS } from "../config";
import type { PlanRca } from "../../features/releasePlans/types";

export interface CreatePlanRcaDto {
  supportTicketNumber?: string;
  rcaNumber?: string;
  keyIssuesTags?: string[];
  learningsTags?: string[];
  technicalDescription?: string;
  referenceFileUrl?: string;
}

export interface UpdatePlanRcaDto {
  supportTicketNumber?: string;
  rcaNumber?: string;
  keyIssuesTags?: string[];
  learningsTags?: string[];
  technicalDescription?: string;
  referenceFileUrl?: string;
}

export const planRcasService = {
  /**
   * Get all RCAs for a plan
   */
  async getByPlanId(planId: string): Promise<PlanRca[]> {
    return httpClient.get<PlanRca[]>(`${API_ENDPOINTS.PLANS}/${planId}/rcas`);
  },

  /**
   * Get RCA by ID
   */
  async getById(planId: string, rcaId: string): Promise<PlanRca> {
    return httpClient.get<PlanRca>(`${API_ENDPOINTS.PLANS}/${planId}/rcas/${rcaId}`);
  },

  /**
   * Create a new RCA for a plan
   */
  async create(planId: string, data: CreatePlanRcaDto): Promise<PlanRca> {
    return httpClient.post<PlanRca>(`${API_ENDPOINTS.PLANS}/${planId}/rcas`, data);
  },

  /**
   * Update an existing RCA
   */
  async update(planId: string, rcaId: string, data: UpdatePlanRcaDto): Promise<PlanRca> {
    return httpClient.put<PlanRca>(`${API_ENDPOINTS.PLANS}/${planId}/rcas/${rcaId}`, data);
  },

  /**
   * Delete an RCA
   */
  async delete(planId: string, rcaId: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.PLANS}/${planId}/rcas/${rcaId}`);
  },
};

