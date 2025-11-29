import { useState, useCallback, useMemo, type ReactNode } from "react";
import { TimelineContext } from "./TimelineContext";
import type {
  TimelineState,
  TimelineActions,
  TimelineConfig,
  TimelineViewportRange,
  PlanPhase,
} from "../types/timeline.types";
import type { PlanTask, PlanMilestone } from "../../../types";
import { DEFAULT_TIMELINE_CONFIG } from "../types/timeline.types";
import { useTimelineCalendars } from "../hooks/useTimelineCalendars";

export interface TimelineProviderProps {
  children: ReactNode;
  initialPhases?: PlanPhase[];
  initialTasks?: PlanTask[];
  initialMilestones?: PlanMilestone[];
  calendarIds?: string[];
  startDate: string;
  endDate: string;
  config?: Partial<TimelineConfig>;
  onPhaseChange?: (phaseId: string, updates: Partial<PlanPhase>) => void;
  onPhaseMove?: (phaseId: string, startDate: string, endDate: string) => void;
}

export function TimelineProvider({
  children,
  initialPhases = [],
  initialTasks = [],
  initialMilestones = [],
  calendarIds = [],
  startDate,
  endDate,
  config = {},
  onPhaseChange,
  onPhaseMove,
}: TimelineProviderProps) {
  const [phases, setPhases] = useState<PlanPhase[]>(initialPhases);
  const [tasks] = useState<PlanTask[]>(initialTasks);
  const [milestones] = useState<PlanMilestone[]>(initialMilestones);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [viewportRange, setViewportRange] = useState<TimelineViewportRange | null>(null);

  // ⚡ OPTIMIZATION: Cargar calendarios solo cuando hay viewport
  const { calendars, isLoading: calendarsLoading } = useTimelineCalendars({
    calendarIds,
    viewportRange,
    enabled: calendarIds.length > 0,
  });

  const timelineConfig: TimelineConfig = useMemo(
    () => ({ ...DEFAULT_TIMELINE_CONFIG, ...config }),
    [config]
  );

  // Actions
  const addPhase = useCallback(
    (phase: PlanPhase) => {
      setPhases((prev) => [...prev, phase]);
    },
    []
  );

  const updatePhase = useCallback(
    (id: string, updates: Partial<PlanPhase>) => {
      setPhases((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      if (onPhaseChange) {
        onPhaseChange(id, updates);
      }
    },
    [onPhaseChange]
  );

  const deletePhase = useCallback((id: string) => {
    setPhases((prev) => prev.filter((p) => p.id !== id));
    if (selectedPhaseId === id) {
      setSelectedPhaseId(null);
    }
  }, [selectedPhaseId]);

  const movePhase = useCallback(
    (id: string, newStartDate: string, newEndDate: string) => {
      setPhases((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, startDate: newStartDate, endDate: newEndDate }
            : p
        )
      );
      if (onPhaseMove) {
        onPhaseMove(id, newStartDate, newEndDate);
      }
    },
    [onPhaseMove]
  );

  const resizePhase = useCallback(
    (id: string, newStartDate: string, newEndDate: string) => {
      movePhase(id, newStartDate, newEndDate);
    },
    [movePhase]
  );

  const selectPhase = useCallback((id: string | null) => {
    setSelectedPhaseId(id);
  }, []);

  const scrollToDate = useCallback((date: string) => {
    // TODO: Implement scroll logic
    console.log("[TimelineProvider] Scroll to date:", date);
  }, []);

  const actions: TimelineActions = useMemo(
    () => ({
      addPhase,
      updatePhase,
      deletePhase,
      movePhase,
      resizePhase,
      selectPhase,
      scrollToDate,
      setViewportRange,
    }),
    [
      addPhase,
      updatePhase,
      deletePhase,
      movePhase,
      resizePhase,
      selectPhase,
      scrollToDate,
    ]
  );

  const state: TimelineState = useMemo(
    () => ({
      phases,
      tasks,
      milestones,
      selectedPhaseId,
      viewportRange,
      config: timelineConfig,
    }),
    [phases, tasks, milestones, selectedPhaseId, viewportRange, timelineConfig]
  );

  const value: TimelineContextValue = useMemo(
    () => ({
      state,
      actions,
      calendars,
      isLoading: calendarsLoading,
    }),
    [state, actions, calendars, calendarsLoading]
  );

  return (
    <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
  );
}

