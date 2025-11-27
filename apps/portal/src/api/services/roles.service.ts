import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name?: string;
  updatedAt?: string; // For optimistic locking
}

export const rolesService = {
  getAll: async (): Promise<Role[]> => {
    return httpClient.get<Role[]>(API_ENDPOINTS.ROLES);
  },

  getById: async (id: string): Promise<Role> => {
    return httpClient.get<Role>(`${API_ENDPOINTS.ROLES}/${id}`);
  },

  create: async (data: CreateRoleDto): Promise<Role> => {
    return httpClient.post<Role>(API_ENDPOINTS.ROLES, data);
  },

  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    return httpClient.put<Role>(`${API_ENDPOINTS.ROLES}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`${API_ENDPOINTS.ROLES}/${id}`);
  },
};

