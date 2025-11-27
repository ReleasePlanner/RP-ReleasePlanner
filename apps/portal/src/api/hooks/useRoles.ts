import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesService, type Role, type CreateRoleDto, type UpdateRoleDto } from '../services/roles.service';

export function useRoles() {
  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: () => rolesService.getAll(),
  });
}

export function useRole(id: string) {
  return useQuery<Role, Error>({
    queryKey: ['roles', id],
    queryFn: () => rolesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation<Role, Error, CreateRoleDto>({
    mutationFn: (data: CreateRoleDto) => rolesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation<Role, Error, { id: string; data: UpdateRoleDto }>({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDto }) =>
      rolesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => rolesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

