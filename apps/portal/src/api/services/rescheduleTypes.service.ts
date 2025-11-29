/**
 * Reschedule Types API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface RescheduleType {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRescheduleTypeDto {
  name: string;
  description?: string;
}

export interface UpdateRescheduleTypeDto {
  name?: string;
  description?: string;
}

export const rescheduleTypesService = {
  async getAll(): Promise<RescheduleType[]> {
    return httpClient.get<RescheduleType[]>(API_ENDPOINTS.RESCHEDULE_TYPES);
  },

  async getById(id: string): Promise<RescheduleType> {
    return httpClient.get<RescheduleType>(`${API_ENDPOINTS.RESCHEDULE_TYPES}/${id}`);
  },

  async create(data: CreateRescheduleTypeDto): Promise<RescheduleType> {
    return httpClient.post<RescheduleType>(API_ENDPOINTS.RESCHEDULE_TYPES, data);
  },

  async update(id: string, data: UpdateRescheduleTypeDto): Promise<RescheduleType> {
    return httpClient.put<RescheduleType>(`${API_ENDPOINTS.RESCHEDULE_TYPES}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.RESCHEDULE_TYPES}/${id}`);
  },
};

