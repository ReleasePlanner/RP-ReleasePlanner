import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentsService, type Talent, type CreateTalentDto, type UpdateTalentDto } from '../services/talents.service';

export const TALENTS_QUERY_KEY = 'talents';

export function useTalents() {
  return useQuery({
    queryKey: [TALENTS_QUERY_KEY],
    queryFn: () => talentsService.getAll(),
  });
}

export function useTalent(id: string | undefined) {
  return useQuery({
    queryKey: [TALENTS_QUERY_KEY, id],
    queryFn: () => talentsService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateTalent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTalentDto) => talentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TALENTS_QUERY_KEY] });
    },
  });
}

export function useUpdateTalent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTalentDto }) =>
      talentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TALENTS_QUERY_KEY] });
    },
  });
}

export function useDeleteTalent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => talentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TALENTS_QUERY_KEY] });
    },
  });
}

