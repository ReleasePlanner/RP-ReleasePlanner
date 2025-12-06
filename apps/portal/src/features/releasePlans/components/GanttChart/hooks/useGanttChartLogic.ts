import { useEffect, useMemo, useRef, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { daysBetween } from "../../../lib/date";
import { PX_PER_DAY, TRACK_HEIGHT, LABEL_WIDTH } from "../../Gantt/constants";
import { safeScrollToX } from "../../../../../utils/dom";
import type {
  PlanTask,
  PlanPhase,
  PlanReference,
} from "../../../types";
import { useGanttDragAndDrop } from "../useGanttDragAndDrop";
import type { CalendarDay } from "../../../../../features/calendar/types";
import { useOptimizedCalendars } from "./useOptimizedCalendars";
import { useOptimizedCalendarDaysMap } from "./useOptimizedCalendarDaysMap";
import { useOptimizedDays, useWeekendIndices } from "./useOptimizedDays";
import { useOptimizedScroll } from "./useOptimizedScroll";
import { useViewportObserver } from "./useViewportObserver";
import {
  getTimelineColors,
  TIMELINE_DIMENSIONS,
} from "../../Gantt/GanttTimeline/constants";
import { TOOLBAR_HEIGHT } from "../../Gantt/GanttTimeline/TimelineToolbar";

export interface UseGanttChartLogicParams {
  startDate: string;
  endDate: string;
  tasks: PlanTask[];
  phases: PlanPhase[];
  calendarIds: string[];
  references: PlanReference[];
  milestoneReferences: PlanReference[];
  onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  onScrollToDateReady?: (scrollToDate: (date: string) => void) => void;
}

export interface UseGanttChartLogicReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  labelWidth: number;
  width: number;
  start: Date;
  totalDays: number;
  days: Date[];
  calendarStartStr: string;
  calendarEndStr: string;
  todayIndex?: number;
  pxPerDay: number;
  trackHeight: number;
  weekendIndices: Set<number>;
  calendarDaysMap: Map<
    string,
    Array<{ day: CalendarDay; calendarName: string }>
  >;
  milestoneReferencesMap: Map<string, PlanReference>;
  setDrag: (drag: {
    phaseId: string;
    phaseIdx: number;
    startIdx: number;
    currentIdx: number;
  }) => void;
  setEditDrag: (drag: {
    phaseId: string;
    phaseIdx: number;
    mode: "move" | "resize-left" | "resize-right";
    anchorIdx: number;
    currentIdx: number;
    originalStartIdx: number;
    originalLen: number;
  }) => void;
  drag: {
    phaseId: string;
    phaseIdx: number;
    startIdx: number;
    currentIdx: number;
  } | null;
  editDrag: {
    phaseId: string;
    phaseIdx: number;
    mode: "move" | "resize-left" | "resize-right";
    anchorIdx: number;
    currentIdx: number;
    originalStartIdx: number;
    originalLen: number;
  } | null;
  clientXToDayIndex: (clientX: number) => number;
  getDayIndex: (date: Date) => number;
  showSelectedDayAlert: (isoDate: string) => void;
  handleJumpToToday: () => void;
  colors: ReturnType<typeof getTimelineColors>;
  phasesOrderKey: string;
  TIMELINE_DIMENSIONS: typeof TIMELINE_DIMENSIONS;
  TOOLBAR_HEIGHT: number;
}

export function useGanttChartLogic({
  startDate,
  endDate: _endDate,
  tasks: _tasks,
  phases,
  calendarIds,
  references: _references,
  milestoneReferences,
  onPhaseRangeChange,
  onScrollToDateReady,
}: UseGanttChartLogicParams): UseGanttChartLogicReturn {
  const labelWidth = LABEL_WIDTH;
  const theme = useTheme();

  // Create a stable key based on phase order AND dates to force re-render when dates change
  // ⚡ CRITICAL: Include dates in the key so components re-render when phase dates change
  const phasesOrderKey = useMemo(() => {
    return phases.map((p) => `${p.id}:${p.startDate || ""}:${p.endDate || ""}`).join(",");
  }, [phases]);

  // Calculate timeline range: from start of year of startDate to end of year of endDate
  const timelineStart = useMemo(() => {
    const y = new Date(startDate).getFullYear();
    return new Date(y, 0, 1); // January 1st of start year
  }, [startDate]);

  const timelineEnd = useMemo(() => {
    if (!_endDate) {
      const currentYear = new Date().getFullYear();
      return new Date(currentYear + 2, 11, 31);
    }

    const endYear = new Date(_endDate).getFullYear();
    const bufferYear = endYear + 2;
    return new Date(bufferYear, 11, 31);
  }, [_endDate]);

  const start = timelineStart;
  const end = timelineEnd;
  const totalDays = useMemo(() => {
    return Math.max(1, daysBetween(start, end));
  }, [start, end]);

  // Memoize calendar date strings to prevent infinite re-renders
  const calendarStartStr = useMemo(
    () => start.toISOString().slice(0, 10),
    [start]
  );
  const calendarEndStr = useMemo(() => end.toISOString().slice(0, 10), [end]);

  const pxPerDay = PX_PER_DAY;
  const trackHeight = TRACK_HEIGHT;
  const width = totalDays * pxPerDay;

  // Use optimized days hook
  const { days, getDayIndex } = useOptimizedDays(start, end);

  // Calculate weekend indices once
  const weekendIndices = useWeekendIndices(start, totalDays);

  const showSelectedDayAlert = useCallback((isoDate: string) => {
    if (
      typeof globalThis.window !== "undefined" &&
      typeof globalThis.window.alert === "function"
    ) {
      try {
        globalThis.window.alert(`Selected day: ${isoDate}`);
      } catch {
        /* ignore alert errors in test environment (jsdom) */
      }
    }
  }, []);

  // Use optimized scroll hook
  const containerRef = useRef<HTMLDivElement>(null);
  useOptimizedScroll({
    containerRef,
    start,
    end,
    pxPerDay,
    totalDays,
    enabled: true,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const { drag, editDrag, setDrag, setEditDrag, clientXToDayIndex } =
    useGanttDragAndDrop({
      days,
      pxPerDay,
      trackHeight,
      onPhaseRangeChange,
      containerRef,
      contentRef,
    });

  // Memoize todayIndex calculation
  const todayIndex = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (t < start || t > end) return undefined;
    const index = Math.floor(
      (t.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, Math.min(totalDays - 1, index));
  }, [start, end, totalDays]);

  // Use optimized calendar loading hook
  const { planCalendars } = useOptimizedCalendars(
    calendarIds,
    calendarIds.length > 0
  );

  // Observe viewport to only process visible days
  const { viewportRange } = useViewportObserver({
    containerRef,
    pxPerDay,
    startDate: start,
    totalDays,
    overscan: 20,
  });

  // Use optimized calendar days map hook with viewport
  const calendarDaysMap = useOptimizedCalendarDaysMap(
    planCalendars,
    start,
    end,
    viewportRange?.startIndex,
    viewportRange?.endIndex
  );

  // Create a map of milestone references by phaseId and date
  const milestoneReferencesMap = useMemo(() => {
    const map = new Map<string, PlanReference>();
    for (const ref of milestoneReferences) {
      if (ref.type === "milestone" && ref.date) {
        const key = `${ref.phaseId || ""}-${ref.date}`;
        map.set(key, ref);
      }
    }
    return map;
  }, [milestoneReferences]);

  // Function to scroll to a specific date
  const scrollToDate = useCallback(
    (dateStr: string) => {
      const el = containerRef.current;
      if (!el) return;

      if (!dateStr || typeof dateStr !== "string" || dateStr.trim() === "") {
        return;
      }

      const dateParts = dateStr.split("-");
      if (dateParts.length !== 3) {
        return;
      }

      const [year, month, day] = dateParts.map(Number);

      if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
        return;
      }

      const targetDate = new Date(Date.UTC(year, month - 1, day));
      targetDate.setHours(0, 0, 0, 0);

      let dayIndex: number;
      if (targetDate < start) {
        dayIndex = 0;
      } else if (targetDate > end) {
        dayIndex = Math.max(0, days.length - 1);
      } else {
        dayIndex = Math.max(
          0,
          Math.min(
            days.length - 1,
            Math.floor(
              (targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            )
          )
        );
      }

      const visibleWidth = Math.max(0, el.clientWidth);
      const target = dayIndex * pxPerDay - visibleWidth / 2;
      const left = Math.max(0, target);
      safeScrollToX(el, left, "smooth");
    },
    [start, end, days, pxPerDay]
  );

  // Expose scrollToDate function to parent via callback
  useEffect(() => {
    if (onScrollToDateReady) {
      onScrollToDateReady(scrollToDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToDate]);

  const handleJumpToToday = useCallback(() => {
    if (todayIndex !== undefined) {
      const el = containerRef.current;
      if (!el) return;

      const visibleWidth = Math.max(0, el.clientWidth);
      const target = todayIndex * pxPerDay - visibleWidth / 2;
      const left = Math.max(0, target);
      safeScrollToX(el, left, "smooth");
    }
  }, [todayIndex, pxPerDay]);

  const colors = getTimelineColors(theme);

  return {
    containerRef,
    contentRef,
    labelWidth,
    width,
    start,
    totalDays,
    days,
    calendarStartStr,
    calendarEndStr,
    todayIndex,
    pxPerDay,
    trackHeight,
    weekendIndices,
    calendarDaysMap,
    milestoneReferencesMap,
    setDrag,
    setEditDrag,
    drag,
    editDrag,
    clientXToDayIndex,
    getDayIndex,
    showSelectedDayAlert,
    handleJumpToToday,
    colors,
    phasesOrderKey,
    TIMELINE_DIMENSIONS,
    TOOLBAR_HEIGHT,
  };
}

