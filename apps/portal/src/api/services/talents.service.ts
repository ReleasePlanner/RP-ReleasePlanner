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

export interface UpdateTalentDto extends CreateTalentDto {
  id: string;
  updatedAt: string;
}

export const talentsService = {
  getAll: async (): Promise<Talent[]> => {
    return httpClient.get<Talent[]>(`${API_ENDPOINTS.TEAMS}/talents`);
  },

  getById: async (id: string): Promise<Talent> => {
    return httpClient.get<Talent>(`${API_ENDPOINTS.TEAMS}/talents/${id}`);
  },

  create: async (data: CreateTalentDto): Promise<Talent> => {
    return httpClient.post<Talent>(`${API_ENDPOINTS.TEAMS}/talents`, data);
  },

  update: async (id: string, data: UpdateTalentDto): Promise<Talent> => {
    return httpClient.put<Talent>(`${API_ENDPOINTS.TEAMS}/talents/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`${API_ENDPOINTS.TEAMS}/talents/${id}`);
  },

  getTotalAllocationPercentage: async (
    talentId: string,
    excludeTeamId?: string,
  ): Promise<number> => {
    const params = excludeTeamId
      ? `?excludeTeamId=${excludeTeamId}`
      : '';
    const response = await httpClient.get<{ total: number }>(
      `${API_ENDPOINTS.TEAMS}/talents/${talentId}/allocation-total${params}`,
    );
    return response.total;
  },
};

