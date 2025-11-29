import type { PlanPhase, PlanTask, PlanMilestone, PlanReference } from "../../../types";
import type { Calendar } from "../../../../../features/calendar/types";

export interface TimelineConfig {
  pxPerDay: number;
  trackHeight: number;
  showTodayMarker: boolean;
  enableDragDrop: boolean;
  enableVirtualization: boolean;
  calendarCacheTime: number;
  overscan: number; // Días extra a renderizar fuera del viewport
}

export const DEFAULT_TIMELINE_CONFIG: TimelineConfig = {
  pxPerDay: 2,
  trackHeight: 40,
  showTodayMarker: true,
  enableDragDrop: true,
  enableVirtualization: true,
  calendarCacheTime: 5 * 60 * 1000, // 5 minutos
  overscan: 10, // Render 10 días extra fuera del viewport
};

export interface TimelineViewportRange {
  start: Date;
  end: Date;
  startIndex: number;
  endIndex: number;
  totalDays: number;
}

export interface TimelineState {
  phases: PlanPhase[];
  tasks: PlanTask[];
  milestones: PlanMilestone[];
  selectedPhaseId: string | null;
  viewportRange: TimelineViewportRange | null;
  config: TimelineConfig;
}

export interface TimelineActions {
  // CRUD de fases
  addPhase: (phase: PlanPhase) => void;
  updatePhase: (id: string, updates: Partial<PlanPhase>) => void;
  deletePhase: (id: string) => void;

  // Drag & Drop
  movePhase: (id: string, startDate: string, endDate: string) => void;
  resizePhase: (id: string, startDate: string, endDate: string) => void;

  // Selección
  selectPhase: (id: string | null) => void;

  // Navegación
  scrollToDate: (date: string) => void;
  setViewportRange: (range: TimelineViewportRange) => void;
}

export interface TimelineContextValue {
  state: TimelineState;
  actions: TimelineActions;
  calendars: Calendar[];
  isLoading: boolean;
}

