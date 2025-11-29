import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Plan } from "../../../../../features/releasePlans/types";

interface LoadingProgress {
  progress: number;
  stage: string;
  isComplete: boolean;
}

/**
 * Hook para rastrear el progreso real de carga del plan
 * Monitorea: módulo lazy, datos necesarios, y renderizado
 */
export function usePlanLoadingProgress(plan: Plan): LoadingProgress {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Iniciando carga...");
  const [isComplete, setIsComplete] = useState(false);
  const queryClient = useQueryClient();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stageProgressRef = useRef<number>(0);
  const completedStagesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const stages = [
      { name: "Cargando módulo...", weight: 15 },
      { name: "Cargando calendarios...", weight: 25 },
      { name: "Cargando productos...", weight: 20 },
      { name: "Cargando equipos...", weight: 15 },
      { name: "Preparando datos...", weight: 15 },
      { name: "Renderizando...", weight: 10 },
    ];

    const totalWeight = stages.reduce((sum, s) => sum + s.weight, 0);

    const updateProgress = (completedStages: number[]) => {
      const completedWeight = completedStages.reduce(
        (sum, idx) => sum + stages[idx].weight,
        0
      );
      const newProgress = Math.min(100, Math.round((completedWeight / totalWeight) * 100));
      
      // Encontrar el último stage completado
      const lastCompletedStage = Math.max(...completedStages, -1);
      const currentStageIndex = lastCompletedStage + 1;
      
      if (currentStageIndex < stages.length) {
        setStage(stages[currentStageIndex].name);
      } else {
        setStage("Completado");
        setIsComplete(true);
      }
      
      setProgress(newProgress);
      stageProgressRef.current = newProgress;
    };

    const checkDataLoading = () => {
      const completed: number[] = [];

      // Stage 0: Módulo lazy (simulado, React Suspense maneja esto)
      // Asumimos que el módulo se está cargando cuando este componente se monta
      completed.push(0);

      // Stage 1: Calendarios
      const calendarIds = plan.metadata?.calendarIds || [];
      if (calendarIds.length === 0) {
        // No hay calendarios, esta etapa se completa inmediatamente
        completed.push(1);
      } else {
        // Verificar si los calendarios están cargados o cargando
        const calendarsStatus = calendarIds.map((id) => {
          const queryState = queryClient.getQueryState(["calendars", "detail", id]);
          return queryState?.status === "success" || queryState?.status === "pending";
        });
        
        // Si todos están cargados o al menos cargando, consideramos completado
        // (porque el progreso real se muestra cuando están en cache)
        if (calendarsStatus.every(Boolean)) {
          completed.push(1);
        }
      }

      // Stage 2: Productos
      const productsQueryState = queryClient.getQueryState(["products", "list"]);
      if (productsQueryState?.status === "success" || productsQueryState?.status === "pending") {
        completed.push(2);
      }

      // Stage 3: Equipos (teams)
      const teamIds = plan.metadata?.teamIds || [];
      if (teamIds.length === 0) {
        completed.push(3);
      } else {
        // Verificar si los equipos están cargados
        const teamsStatus = teamIds.map((id) => {
          const queryState = queryClient.getQueryState(["teams", "detail", id]);
          return queryState?.status === "success" || queryState?.status === "pending";
        });
        
        if (teamsStatus.every(Boolean)) {
          completed.push(3);
        }
      }

      // Stage 4: Preparando datos (features se cargan lazy cuando se necesita)
      // Esta etapa se completa cuando los datos básicos están listos
      if (completed.length >= 3) {
        completed.push(4);
      }

      // Stage 5: Renderizando (se completa cuando el componente se monta)
      // Esto se maneja cuando Suspense resuelve

      updateProgress(completed);

      // Si todas las etapas críticas están completas, marcar como completo
      if (completed.length >= 5 && progress >= 90) {
        setTimeout(() => {
          setProgress(100);
          setStage("Completado");
          setIsComplete(true);
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }, 300);
      }
    };

    // Iniciar verificación con intervalo más frecuente para mejor feedback
    checkIntervalRef.current = setInterval(checkDataLoading, 150);

    // Verificación inicial inmediata
    checkDataLoading();

    // Timeout de seguridad: si después de 5 segundos no está completo, forzar completado
    const safetyTimeout = setTimeout(() => {
      if (!isComplete && progress < 100) {
        setProgress(100);
        setStage("Completado");
        setIsComplete(true);
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      }
    }, 5000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      clearTimeout(safetyTimeout);
    };
  }, [plan, queryClient, isComplete, progress]);

  return {
    progress,
    stage,
    isComplete,
  };
}

