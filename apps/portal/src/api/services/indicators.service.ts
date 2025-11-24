import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export type IndicatorStatus = 'active' | 'inactive' | 'archived';

export interface Indicator {
  id: string;
  name: string;
  description?: string;
  formula?: string;
  status: IndicatorStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIndicatorDto {
  name: string;
  description?: string;
  formula?: string;
  status?: IndicatorStatus;
}

export interface UpdateIndicatorDto {
  name?: string;
  description?: string;
  formula?: string;
  status?: IndicatorStatus;
}

export const indicatorsService = {
  getAll: async (): Promise<Indicator[]> => {
    return httpClient.get<Indicator[]>(API_ENDPOINTS.INDICATORS);
  },

  getById: async (id: string): Promise<Indicator> => {
    return httpClient.get<Indicator>(`${API_ENDPOINTS.INDICATORS}/${id}`);
  },

  create: async (data: CreateIndicatorDto): Promise<Indicator> => {
    return httpClient.post<Indicator>(API_ENDPOINTS.INDICATORS, data);
  },

  update: async (id: string, data: UpdateIndicatorDto): Promise<Indicator> => {
    return httpClient.put<Indicator>(`${API_ENDPOINTS.INDICATORS}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`${API_ENDPOINTS.INDICATORS}/${id}`);
  },
};

