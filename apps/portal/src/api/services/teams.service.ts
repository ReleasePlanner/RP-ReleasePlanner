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
  id?: string; // Required by backend DTO validation
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
  // Filter out assignments without talent data and map to talents
  const talents = (apiTeam.talentAssignments || [])
    .filter((assignment) => assignment.talent != null) // Only include assignments with talent data
    .map((assignment) => ({
      id: assignment.talentId,
      name: assignment.talent!.name,
      email: assignment.talent!.email,
      phone: assignment.talent!.phone,
      roleId: assignment.talent!.roleId,
      role: assignment.talent!.role,
      teamId: assignment.teamId,
      allocationPercentage: assignment.allocationPercentage,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    }));

  return {
    id: apiTeam.id,
    name: apiTeam.name,
    description: apiTeam.description,
    type: apiTeam.type,
    talents,
    createdAt: apiTeam.createdAt,
    updatedAt: apiTeam.updatedAt,
  };
}

export const teamsService = {
  getAll: async (): Promise<Team[]> => {
    const apiTeams = await httpClient.get<TeamApiResponse[]>(API_ENDPOINTS.TEAMS);
    // Debug: Log API response to verify talentAssignments are being loaded
    console.log('[teamsService.getAll] API Response:', {
      teamsCount: apiTeams.length,
      teams: apiTeams.map((t) => ({
        id: t.id,
        name: t.name,
        talentAssignmentsCount: t.talentAssignments?.length || 0,
        talentAssignments: t.talentAssignments,
        hasTalentAssignments: !!t.talentAssignments,
        talentAssignmentsIsArray: Array.isArray(t.talentAssignments),
      })),
    });
    const mappedTeams = apiTeams.map(mapApiTeamToTeam);
    console.log('[teamsService.getAll] Mapped Teams:', {
      teamsCount: mappedTeams.length,
      teams: mappedTeams.map((t) => ({
        id: t.id,
        name: t.name,
        talentsCount: t.talents?.length || 0,
        talents: t.talents,
        hasTalents: !!t.talents,
        talentsIsArray: Array.isArray(t.talents),
      })),
    });
    return mappedTeams;
  },

  getById: async (id: string): Promise<Team> => {
    const apiTeam = await httpClient.get<TeamApiResponse>(`${API_ENDPOINTS.TEAMS}/${id}`);
    // Debug: Log the API response to verify talentAssignments are being loaded
    console.log('[teamsService.getById] API Response for team:', id, {
      teamId: apiTeam.id,
      teamName: apiTeam.name,
      talentAssignmentsCount: apiTeam.talentAssignments?.length || 0,
      talentAssignments: apiTeam.talentAssignments,
      hasTalentAssignments: !!apiTeam.talentAssignments,
      talentAssignmentsIsArray: Array.isArray(apiTeam.talentAssignments),
    });
    const mappedTeam = mapApiTeamToTeam(apiTeam);
    console.log('[teamsService.getById] Mapped Team:', {
      teamId: mappedTeam.id,
      talentsCount: mappedTeam.talents?.length || 0,
      talents: mappedTeam.talents,
      hasTalents: !!mappedTeam.talents,
      talentsIsArray: Array.isArray(mappedTeam.talents),
    });
    return mappedTeam;
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

  addTalentToTeam: async (
    teamId: string,
    talentId: string,
    allocationPercentage: number,
  ): Promise<Team> => {
    const apiTeam = await httpClient.post<TeamApiResponse>(
      `${API_ENDPOINTS.TEAMS}/${teamId}/talents/add`,
      {
        talentId,
        allocationPercentage,
      },
    );
    return mapApiTeamToTeam(apiTeam);
  },

  addMultipleTalentsToTeam: async (
    teamId: string,
    talents: Array<{ talentId: string; allocationPercentage: number }>,
  ): Promise<Team> => {
    const apiTeam = await httpClient.post<TeamApiResponse>(
      `${API_ENDPOINTS.TEAMS}/${teamId}/talents/add-multiple`,
      { talents },
    );
    return mapApiTeamToTeam(apiTeam);
  },

  createTalentAndAssign: async (
    teamId: string,
    talentData: {
      name: string;
      email?: string;
      phone?: string;
      roleId?: string;
      allocationPercentage: number;
    },
  ): Promise<Team> => {
    const apiTeam = await httpClient.post<TeamApiResponse>(
      `${API_ENDPOINTS.TEAMS}/${teamId}/talents/create-and-assign`,
      talentData,
    );
    return mapApiTeamToTeam(apiTeam);
  },
};

