import { useTimelineContext } from "../context/TimelineContext";

/**
 * Hook principal para acceder al contexto del Timeline
 * Proporciona acceso a estado y acciones del timeline
 */
export function useTimeline() {
  return useTimelineContext();
}

