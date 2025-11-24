import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { indicatorsService, type Indicator, type CreateIndicatorDto, type UpdateIndicatorDto } from '../services/indicators.service';

export function useIndicators() {
  return useQuery({
    queryKey: ['indicators'],
    queryFn: () => indicatorsService.getAll(),
  });
}

export function useIndicator(id: string) {
  return useQuery({
    queryKey: ['indicators', id],
    queryFn: () => indicatorsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIndicatorDto) => indicatorsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
    },
  });
}

export function useUpdateIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIndicatorDto }) =>
      indicatorsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
    },
  });
}

export function useDeleteIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => indicatorsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
    },
  });
}

