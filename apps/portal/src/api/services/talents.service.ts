import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface Talent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roleId?: string;
  role?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTalentDto {
  name: string;
  email?: string;
  phone?: string;
  roleId?: string;
}

export interface UpdateTalentDto {
  name?: string;
  email?: string;
  phone?: string;
  roleId?: string;
}

// Note: Since there's no separate talent endpoint, we'll create talents
// through the team service by creating them inline when assigning to teams.
// For now, we'll use a workaround: create talents via a direct API call
// or handle it in the team creation flow.

export const talentsService = {
  // Create talent - this will need to be implemented in the backend
  // For now, we'll try to use /teams/talents endpoint if it exists
  create: async (data: CreateTalentDto): Promise<Talent> => {
    try {
      // Try the teams/talents endpoint first
      return await httpClient.post<Talent>(`${API_ENDPOINTS.TEAMS}/talents`, data);
    } catch (error) {
      // If that fails, we might need to create talent differently
      // For now, throw the error and let the caller handle it
      throw error;
    }
  },
};

