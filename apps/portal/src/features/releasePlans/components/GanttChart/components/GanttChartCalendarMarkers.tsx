import { memo } from "react";
import { Tooltip, useTheme } from "@mui/material";
import type { CalendarDay } from "../../../../../features/calendar/types";

export type GanttChartCalendarMarkersProps = {
  days: Date[];
  calendarDaysMap: Map<string, Array<{ day: CalendarDay; calendarName: string }>>;
  pxPerDay: number;
};

/**
 * Renders calendar day markers (holidays/special days) across the timeline
 * Follows SRP - only responsible for calendar day visualization
 * ⚡ OPTIMIZATION: Memoized to prevent unnecessary re-renders
 */
export const GanttChartCalendarMarkers = memo(
  function GanttChartCalendarMarkers({
    days,
    calendarDaysMap,
    pxPerDay,
  }: GanttChartCalendarMarkersProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    
    return (
      <>
        {days.map((d, i) => {
          const dateKey = d.toISOString().slice(0, 10);
          const calendarDays = calendarDaysMap.get(dateKey) || [];
          const isCalendarDay = calendarDays.length > 0;

          if (!isCalendarDay) return null;

          return (
            <Tooltip
              key={`cal-${i}`}
              title={
                <div style={{ fontSize: "0.8125rem", maxWidth: 300 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: "6px",
                      fontSize: "0.875rem",
                      color: isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.95)",
                    }}
                  >
                    {calendarDays.length === 1
                      ? calendarDays[0].day.name
                      : `${calendarDays.length} día${
                          calendarDays.length > 1 ? "s" : ""
                        } especial${
                          calendarDays.length > 1 ? "es" : ""
                        }`}
                  </div>
                  {calendarDays.map(({ day, calendarName }, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: "6px",
                        paddingBottom:
                          idx < calendarDays.length - 1 ? "6px" : 0,
                        borderBottom:
                          idx < calendarDays.length - 1
                            ? isDark
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(0, 0, 0, 0.1)"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: "0.8125rem",
                            color: isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.95)",
                          }}
                        >
                          {day.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor:
                              day.type === "holiday"
                                ? "rgba(76, 175, 80, 0.2)"
                                : "rgba(33, 150, 243, 0.2)",
                            color:
                              day.type === "holiday"
                                ? "#4caf50"
                                : "#2196f3",
                            fontWeight: 500,
                          }}
                        >
                          {day.type === "holiday" ? "Festivo" : "Especial"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          opacity: 0.85,
                          marginBottom: "2px",
                          color: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.85)",
                        }}
                      >
                                <span role="img" aria-label="Calendar icon">
                                  📅
                                </span>{" "}
                        {calendarName}
                      </div>
                      {day.description && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            opacity: 0.9,
                            marginTop: "4px",
                            fontStyle: "italic",
                            color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
                          }}
                        >
                          {day.description}
                        </div>
                      )}
                      {day.recurring && (
                        <div
                          style={{
                            fontSize: "0.6875rem",
                            opacity: 0.8,
                            marginTop: "2px",
                            color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          🔁 Recurrente
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              }
              arrow
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(0, 0, 0, 0.9)",
                    color: isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.95)",
                    "& .MuiTooltip-arrow": {
                      color: isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(0, 0, 0, 0.9)",
                    },
                  },
                },
              }}
            >
              <div
                className="absolute top-0 pointer-events-auto z-5"
                style={{
                  left: i * pxPerDay,
                  width: pxPerDay,
                  height: "100%",
                  backgroundColor: "rgba(129, 199, 132, 0.25)",
                  borderLeft: `2px solid rgba(76, 175, 80, 0.4)`,
                  borderRight: `2px solid rgba(76, 175, 80, 0.4)`,
                  cursor: "help",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(129, 199, 132, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(129, 199, 132, 0.25)";
                }}
              />
            </Tooltip>
          );
        })}
      </>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if days array or calendarDaysMap changed
    if (prevProps.days.length !== nextProps.days.length) return false;
    if (prevProps.pxPerDay !== nextProps.pxPerDay) return false;
    if (prevProps.calendarDaysMap !== nextProps.calendarDaysMap) return false;
    return true;
  }
);

