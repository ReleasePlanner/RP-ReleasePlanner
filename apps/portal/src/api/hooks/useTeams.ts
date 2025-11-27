import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService, type Team, type CreateTeamDto, type UpdateTeamDto } from '../services/teams.service';

export function useTeams() {
  return useQuery<Team[], Error>({
    queryKey: ['teams'],
    queryFn: () => teamsService.getAll(),
  });
}

export function useTeam(id: string) {
  return useQuery<Team, Error>({
    queryKey: ['teams', id],
    queryFn: () => teamsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation<Team, Error, CreateTeamDto>({
    mutationFn: (data: CreateTeamDto) => teamsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation<Team, Error, { id: string; data: UpdateTeamDto }>({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamDto }) =>
      teamsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => teamsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

