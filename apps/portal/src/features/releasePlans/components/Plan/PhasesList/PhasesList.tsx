import { useState, useEffect } from "react";
import { List, Box } from "@mui/material";
import type { PlanPhase } from "../../../types";
import { TRACK_HEIGHT, LANE_GAP } from "../../Gantt/constants";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  PhaseSpacer,
  AddPhaseButton,
  AutoGenerateButton,
  PhaseRow,
  ReorderPhasesButton,
  SortablePhaseRow,
} from "./components";
import { usePhasesListStyles } from "./hooks";

export type PhasesListProps = {
  readonly phases: PlanPhase[];
  readonly onAdd: () => void;
  readonly onEdit: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly onView?: (id: string) => void;
  readonly onAutoGenerate?: () => void;
  readonly calendarStart?: string;
  readonly calendarEnd?: string;
  readonly headerOffsetTopPx?: number;
  readonly onPhaseRangeChange?: (
    id: string,
    start: string,
    end: string
  ) => void;
  readonly onReorderPhases?: (reorderedPhases: PlanPhase[]) => void;
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
  onReorderPhases,
}: PhasesListProps) {
  const styles = usePhasesListStyles();
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [localPhases, setLocalPhases] = useState(phases);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localPhases.findIndex((p) => p.id === active.id);
      const newIndex = localPhases.findIndex((p) => p.id === over.id);

      const reorderedPhases = arrayMove(localPhases, oldIndex, newIndex);
      setLocalPhases(reorderedPhases);

      if (onReorderPhases) {
        onReorderPhases(reorderedPhases);
      }
    }
  };

  const handleToggleReorderMode = () => {
    if (isReorderMode) {
      // Exiting reorder mode - reset to original order if needed
      setLocalPhases(phases);
    }
    setIsReorderMode(!isReorderMode);
  };

  // Sync local phases with prop changes
  useEffect(() => {
    if (!isReorderMode) {
      setLocalPhases(phases);
    }
  }, [phases, isReorderMode]);

  const displayPhases = isReorderMode ? localPhases : phases;

  return (
    <Box sx={{ position: "relative" }}>
      <PhaseSpacer headerOffsetTopPx={headerOffsetTopPx} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
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
            sx={{
              height: TRACK_HEIGHT,
              marginBottom: `${LANE_GAP}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: 1,
              gap: 0.5,
            }}
          >
            <AddPhaseButton onAdd={onAdd} styles={styles} />
            {onReorderPhases && (
              <ReorderPhasesButton
                isReorderMode={isReorderMode}
                onToggleReorderMode={handleToggleReorderMode}
                styles={styles}
              />
            )}
          </Box>

          <SortableContext
            items={displayPhases.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {displayPhases.map((phase, index) =>
              isReorderMode ? (
                <SortablePhaseRow
                  key={phase.id}
                  phase={phase}
                  isLast={index === displayPhases.length - 1}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  calendarStart={calendarStart}
                  calendarEnd={calendarEnd}
                  onPhaseRangeChange={onPhaseRangeChange}
                  styles={styles}
                  isReorderMode={isReorderMode}
                />
              ) : (
                <PhaseRow
                  key={phase.id}
                  phase={phase}
                  isLast={index === displayPhases.length - 1}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  calendarStart={calendarStart}
                  calendarEnd={calendarEnd}
                  onPhaseRangeChange={onPhaseRangeChange}
                  styles={styles}
                />
              )
            )}
          </SortableContext>
        </List>
      </DndContext>

      {onAutoGenerate && (
        <AutoGenerateButton onAutoGenerate={onAutoGenerate} styles={styles} />
      )}
    </Box>
  );
}
