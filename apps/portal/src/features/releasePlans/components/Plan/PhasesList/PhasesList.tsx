import { List, Box } from "@mui/material";
import type { PlanPhase } from "../../../types";
import { TRACK_HEIGHT, LANE_GAP } from "../../Gantt/constants";
import {
  PhaseSpacer,
  AddPhaseButton,
  AutoGenerateButton,
  PhaseRow,
} from "./components";
import { usePhasesListStyles } from "./hooks";

export type PhasesListProps = {
  readonly phases: PlanPhase[];
  readonly onAdd: () => void;
  readonly onEdit: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly onView?: (id: string) => void;
  readonly onAutoGenerate?: () => void;
  readonly calendarStart: string; // Required: each phase must show its timeline
  readonly calendarEnd: string; // Required: each phase must show its timeline
  readonly headerOffsetTopPx?: number;
  readonly onPhaseRangeChange?: (
    id: string,
    start: string,
    end: string
  ) => void;
};

export default function PhasesList({
  phases,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onAutoGenerate,
  calendarStart,
  calendarEnd,
  headerOffsetTopPx,
  onPhaseRangeChange,
}: PhasesListProps) {
  const styles = usePhasesListStyles();

  return (
    <Box sx={{ position: "relative" }}>
      <PhaseSpacer headerOffsetTopPx={headerOffsetTopPx} />

      <List
        dense
        disablePadding
        sx={{
          "& .MuiListItem-root": {
            minHeight: TRACK_HEIGHT,
            padding: 0,
          },
        }}
      >
        <Box
          component="li"
          sx={{
            height: TRACK_HEIGHT,
            marginBottom: `${LANE_GAP}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: 1,
            gap: 0.5,
            listStyle: "none",
            minHeight: TRACK_HEIGHT,
          }}
        >
          <AddPhaseButton onAdd={onAdd} styles={styles} />
        </Box>

        {/* ⚡ CRITICAL: Use the same phases array and order as GanttChart timeline to maintain alignment */}
        {/* The index here must match the idx used in GanttChart for laneTop(idx) */}
        {phases.map((phase, index) => {
          // Ensure unique key - use id if available, otherwise use index
          const uniqueKey = phase.id || `phase-${index}`;
          return (
            <PhaseRow
              key={uniqueKey}
              phase={phase}
              isLast={index === phases.length - 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              calendarStart={calendarStart}
              calendarEnd={calendarEnd}
              onPhaseRangeChange={onPhaseRangeChange}
              styles={styles}
            />
          );
        })}
      </List>

      {onAutoGenerate && (
        <AutoGenerateButton onAutoGenerate={onAutoGenerate} styles={styles} />
      )}
    </Box>
  );
}
