/**
 * Reschedule Types React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rescheduleTypesService, CreateRescheduleTypeDto, UpdateRescheduleTypeDto } from '../services/rescheduleTypes.service';

const QUERY_KEYS = {
  all: ['rescheduleTypes'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useRescheduleTypes() {
  return useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: () => rescheduleTypesService.getAll(),
  });
}

export function useRescheduleType(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => rescheduleTypesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateRescheduleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRescheduleTypeDto) => rescheduleTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

export function useUpdateRescheduleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRescheduleTypeDto }) =>
      rescheduleTypesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteRescheduleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rescheduleTypesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

