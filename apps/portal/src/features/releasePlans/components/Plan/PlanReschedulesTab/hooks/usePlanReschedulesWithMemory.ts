/**
 * Hook para obtener reschedules consolidados de todas las fases del plan,
 * combinando memoria (pendientes) y base de datos (persistidos)
 */

import { useMemo } from 'react';
import { usePlanReschedules } from '@/api/hooks/usePlans';
import type { PlanPhase, Plan } from '../../../../types';
import type { CombinedReschedule } from '../../../PhaseEditDialog/hooks/usePhaseReschedulesWithMemory';

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
): CombinedReschedule | null {
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

export interface UsePlanReschedulesWithMemoryProps {
  planId: string;
  originalPhases?: PlanPhase[] | null; // Fases originales desde el plan (antes de cambios)
  currentPhases?: PlanPhase[] | null; // Fases actuales desde localMetadata (con cambios pendientes)
}

/**
 * Hook que consolida reschedules de todas las fases del plan,
 * combinando pendientes (memoria) con persistidos (BD)
 * Ordena por fase y luego por fecha dentro de cada fase
 */
export function usePlanReschedulesWithMemory({
  planId,
  originalPhases = [],
  currentPhases = [],
}: UsePlanReschedulesWithMemoryProps) {
  // Obtener reschedules persistidos de la BD
  const { 
    data: persistedReschedules = [], 
    isLoading, 
    error 
  } = usePlanReschedules(planId);

  // Detectar reschedules pendientes para todas las fases
  const pendingReschedules = useMemo(() => {
    if (!originalPhases || !currentPhases) {
      return [];
    }

    const pending: CombinedReschedule[] = [];

    // Crear mapas para acceso rápido
    const originalPhasesMap = new Map<string, PlanPhase>();
    originalPhases.forEach((p) => {
      if (p.id) {
        originalPhasesMap.set(p.id, p);
      }
    });

    const currentPhasesMap = new Map<string, PlanPhase>();
    currentPhases.forEach((p) => {
      if (p.id) {
        currentPhasesMap.set(p.id, p);
      }
    });

    // Detectar cambios para cada fase actual
    currentPhasesMap.forEach((currentPhase, phaseId) => {
      const originalPhase = originalPhasesMap.get(phaseId);
      const pendingReschedule = detectDateChanges(originalPhase, currentPhase);
      if (pendingReschedule) {
        pending.push(pendingReschedule);
      }
    });

    return pending;
  }, [originalPhases, currentPhases]);

  // Consolidar y ordenar reschedules
  const consolidatedReschedules = useMemo(() => {
    const all: CombinedReschedule[] = [];

    // Agregar reschedules pendientes
    pendingReschedules.forEach((r) => {
      all.push(r);
    });

    // Agregar reschedules persistidos
    persistedReschedules.forEach((r) => {
      all.push({
        ...r,
        isPending: false,
      });
    });

    // Ordenar: primero por fase (alfabéticamente por nombre), luego por fecha descendente
    return all.sort((a, b) => {
      // Primero comparar por nombre de fase
      const phaseComparison = (a.phaseName || '').localeCompare(b.phaseName || '');
      if (phaseComparison !== 0) {
        return phaseComparison;
      }

      // Si es la misma fase, ordenar por fecha descendente (más recientes primero)
      const dateA = new Date(a.rescheduledAt).getTime();
      const dateB = new Date(b.rescheduledAt).getTime();
      return dateB - dateA;
    });
  }, [pendingReschedules, persistedReschedules]);

  return {
    reschedules: consolidatedReschedules,
    isLoading,
    error,
    hasPendingReschedules: pendingReschedules.length > 0,
    pendingCount: pendingReschedules.length,
  };
}

