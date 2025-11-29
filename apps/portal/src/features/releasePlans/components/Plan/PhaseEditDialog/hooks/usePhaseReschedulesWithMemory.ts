/**
 * Hook para obtener reschedules combinando memoria (pendientes) y base de datos (persistidos)
 */

import { useMemo } from 'react';
import { usePhaseReschedules } from '@/api/hooks/usePlans';
import type { PlanPhase } from '../../../../types';

export interface PendingReschedule {
  id: string; // Temporal ID
  planPhaseId: string;
  phaseName: string;
  rescheduledAt: string;
  originalStartDate?: string;
  originalEndDate?: string;
  newStartDate?: string;
  newEndDate?: string;
  rescheduleTypeId?: string;
  rescheduleTypeName?: string;
  ownerId?: string;
  ownerName?: string;
  isPending: true; // Flag para identificar reschedules pendientes
}

export interface PersistedReschedule {
  id: string;
  planPhaseId: string;
  phaseName: string;
  rescheduledAt: string;
  originalStartDate?: string;
  originalEndDate?: string;
  newStartDate?: string;
  newEndDate?: string;
  rescheduleTypeId?: string;
  rescheduleTypeName?: string;
  ownerId?: string;
  ownerName?: string;
  isPending?: false;
}

export type CombinedReschedule = PendingReschedule | PersistedReschedule;

/**
 * Normaliza una fecha para comparación (solo YYYY-MM-DD)
 */
function normalizeDate(date: string | null | undefined): string | null {
  if (!date) return null;
  const dateStr = date.toString().split('T')[0];
  return dateStr.split(' ')[0] || null;
}

/**
 * Detecta cambios de fechas entre fase original y fase actual
 */
function detectDateChanges(
  originalPhase: PlanPhase | null | undefined,
  currentPhase: PlanPhase | null | undefined
): PendingReschedule | null {
  if (!originalPhase || !currentPhase || !originalPhase.id || !currentPhase.id) {
    return null;
  }

  if (originalPhase.id !== currentPhase.id) {
    return null; // Diferentes fases
  }

  const originalStartDate = normalizeDate(originalPhase.startDate);
  const originalEndDate = normalizeDate(originalPhase.endDate);
  const newStartDate = normalizeDate(currentPhase.startDate);
  const newEndDate = normalizeDate(currentPhase.endDate);

  const startDateChanged = 
    (originalStartDate !== null || newStartDate !== null) && 
    originalStartDate !== newStartDate;
  const endDateChanged = 
    (originalEndDate !== null || newEndDate !== null) && 
    originalEndDate !== newEndDate;

  if (!startDateChanged && !endDateChanged) {
    return null; // No hay cambios
  }

  // Crear reschedule pendiente
  return {
    id: `pending-${currentPhase.id}-${Date.now()}`,
    planPhaseId: currentPhase.id,
    phaseName: currentPhase.name || 'Unknown',
    rescheduledAt: new Date().toISOString(),
    originalStartDate: originalStartDate || undefined,
    originalEndDate: originalEndDate || undefined,
    newStartDate: newStartDate || undefined,
    newEndDate: newEndDate || undefined,
    rescheduleTypeName: 'Default', // Se asignará cuando se guarde
    isPending: true,
  };
}

export interface UsePhaseReschedulesWithMemoryProps {
  planId: string;
  phaseId: string;
  originalPhase?: PlanPhase | null; // Fase original desde el plan
  currentPhase?: PlanPhase | null; // Fase actual desde localMetadata
}

/**
 * Hook que combina reschedules de memoria (pendientes) con los de la base de datos
 */
export function usePhaseReschedulesWithMemory({
  planId,
  phaseId,
  originalPhase,
  currentPhase,
}: UsePhaseReschedulesWithMemoryProps) {
  // Obtener reschedules persistidos de la BD
  const { 
    data: persistedReschedules = [], 
    isLoading, 
    error 
  } = usePhaseReschedules(planId, phaseId);

  // Detectar reschedule pendiente en memoria
  const pendingReschedule = useMemo(() => {
    return detectDateChanges(originalPhase, currentPhase);
  }, [originalPhase, currentPhase]);

  // Combinar reschedules pendientes con persistidos
  const combinedReschedules = useMemo(() => {
    const all: CombinedReschedule[] = [];

    // Agregar reschedule pendiente primero (más reciente)
    if (pendingReschedule) {
      all.push(pendingReschedule);
    }

    // Agregar reschedules persistidos
    persistedReschedules.forEach((r) => {
      all.push({
        ...r,
        isPending: false,
      });
    });

    // Ordenar por fecha descendente (más recientes primero)
    return all.sort((a, b) => {
      const dateA = new Date(a.rescheduledAt).getTime();
      const dateB = new Date(b.rescheduledAt).getTime();
      return dateB - dateA;
    });
  }, [pendingReschedule, persistedReschedules]);

  return {
    reschedules: combinedReschedules,
    isLoading,
    error,
    hasPendingReschedule: !!pendingReschedule,
  };
}

