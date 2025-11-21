import { useState, useEffect } from "react";
import type { PlanPhase } from "../../../../types";
import {
  getCurrentDateUTC,
  utcToLocalDate,
  addDays,
} from "../../../../lib/date";

export function usePhaseForm(open: boolean, phase: PlanPhase | null) {
  const [formData, setFormData] = useState<Partial<PlanPhase>>({
    name: "",
    startDate: "",
    endDate: "",
    color: "#185ABD",
  });

  useEffect(() => {
    if (open && phase) {
      // Convert UTC dates to local for display in inputs
      setFormData({
        name: phase.name || "",
        startDate: phase.startDate ? utcToLocalDate(phase.startDate) : "",
        endDate: phase.endDate ? utcToLocalDate(phase.endDate) : "",
        color: phase.color || "#185ABD",
      });
    } else if (open && !phase) {
      // New phase defaults - use UTC dates, convert to local for input
      const todayUTC = getCurrentDateUTC();
      const todayDate = new Date(
        Date.UTC(
          Number.parseInt(todayUTC.split("-")[0], 10),
          Number.parseInt(todayUTC.split("-")[1], 10) - 1,
          Number.parseInt(todayUTC.split("-")[2], 10)
        )
      );
      const weekLaterUTC = addDays(todayDate, 7)
        .toISOString()
        .slice(0, 10);
      // Convert to local for display in input
      setFormData({
        name: "",
        startDate: utcToLocalDate(todayUTC),
        endDate: utcToLocalDate(weekLaterUTC),
        color: "#185ABD",
      });
    }
  }, [open, phase]);

  return { formData, setFormData };
}

