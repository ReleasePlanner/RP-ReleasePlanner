import { createContext, useContext } from "react";
import type { TimelineContextValue } from "../types/timeline.types";

export const TimelineContext = createContext<TimelineContextValue | null>(null);

export function useTimelineContext() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimelineContext must be used within TimelineProvider");
  }
  return context;
}

