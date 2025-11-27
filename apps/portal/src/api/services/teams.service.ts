import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export enum TeamType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  HYBRID = 'hybrid',
}

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
  teamId: string;
  allocationPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  type: TeamType;
  talents: Talent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTalentDto {
  name: string;
  email?: string;
  phone?: string;
  roleId?: string;
  allocationPercentage?: number;
}

export interface CreateTeamTalentAssignmentDto {
  talentId: string;
  allocationPercentage: number;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  type?: TeamType;
  talentAssignments?: CreateTeamTalentAssignmentDto[];
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  type?: TeamType;
  talentAssignments?: CreateTeamTalentAssignmentDto[];
  updatedAt?: string; // For optimistic locking
}

// API Response interfaces (what the backend actually returns)
interface TeamTalentAssignmentResponse {
  teamId: string;
  talentId: string;
  allocationPercentage: number;
  talent?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    roleId?: string;
    role?: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface TeamApiResponse {
  id: string;
  name: string;
  description?: string;
  type: TeamType;
  talentAssignments: TeamTalentAssignmentResponse[];
  createdAt: string;
  updatedAt: string;
}

// Mapper functions to convert API response to frontend format
function mapApiTeamToTeam(apiTeam: TeamApiResponse): Team {
  return {
    id: apiTeam.id,
    name: apiTeam.name,
    description: apiTeam.description,
    type: apiTeam.type,
    talents: apiTeam.talentAssignments.map((assignment) => ({
      id: assignment.talentId,
      name: assignment.talent?.name || '',
      email: assignment.talent?.email,
      phone: assignment.talent?.phone,
      roleId: assignment.talent?.roleId,
      role: assignment.talent?.role,
      teamId: assignment.teamId,
      allocationPercentage: assignment.allocationPercentage,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    })),
    createdAt: apiTeam.createdAt,
    updatedAt: apiTeam.updatedAt,
  };
}

export const teamsService = {
  getAll: async (): Promise<Team[]> => {
    const apiTeams = await httpClient.get<TeamApiResponse[]>(API_ENDPOINTS.TEAMS);
    return apiTeams.map(mapApiTeamToTeam);
  },

  getById: async (id: string): Promise<Team> => {
    const apiTeam = await httpClient.get<TeamApiResponse>(`${API_ENDPOINTS.TEAMS}/${id}`);
    return mapApiTeamToTeam(apiTeam);
  },

  create: async (data: CreateTeamDto): Promise<Team> => {
    const apiTeam = await httpClient.post<TeamApiResponse>(API_ENDPOINTS.TEAMS, data);
    return mapApiTeamToTeam(apiTeam);
  },

  update: async (id: string, data: UpdateTeamDto): Promise<Team> => {
    const apiTeam = await httpClient.put<TeamApiResponse>(`${API_ENDPOINTS.TEAMS}/${id}`, data);
    return mapApiTeamToTeam(apiTeam);
  },

  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`${API_ENDPOINTS.TEAMS}/${id}`);
  },
};

