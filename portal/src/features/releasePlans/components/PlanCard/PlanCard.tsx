import {
  Card,
  CardContent,
  Collapse,
} from "@mui/material";
import { useCallback, useState } from "react";
import type { Plan } from "../types";
import GanttChart from "../GanttChart/GanttChart";
import PlanHeader from "../Plan/PlanHeader/PlanHeader";
import ResizableSplit from "../Plan/ResizableSplit/ResizableSplit";
import PhaseEditDialog from "../Plan/PhaseEditDialog/PhaseEditDialog";
import CommonDataCard from "../Plan/CommonDataCard/CommonDataCard";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { addPhase, updatePhase } from "../../slice";
import { setPlanLeftPercent, setPlanExpanded } from "../../../../store/store";
import AddPhaseDialog from "../Plan/AddPhaseDialog";

// left pane subcomponents handle their own label formatting

export type PlanCardProps = {
  plan: Plan;
};

export default function PlanCard({ plan }: PlanCardProps) {
  const { metadata, tasks } = plan;
  const dispatch = useAppDispatch();
  const savedPercent = useAppSelector(
    (s) => s.ui.planLeftPercentByPlanId?.[plan.id]
  );
  const [leftPercent, setLeftPercent] = useState<number>(savedPercent ?? 35);
  const savedExpanded = useAppSelector(
    (s) => s.ui.planExpandedByPlanId?.[plan.id]
  );
  const expanded = savedExpanded ?? true;
  // Add Phase dialog
  const [phaseOpen, setPhaseOpen] = useState(false);

  // Edit Phase dialog (start/end/color)
  const [editOpen, setEditOpen] = useState(false);
  const [editPhaseId, setEditPhaseId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editColor, setEditColor] = useState("#217346");
  const openEdit = useCallback(
    (phaseId: string) => {
      const ph = (plan.metadata.phases ?? []).find((x) => x.id === phaseId);
      if (!ph) return;
      setEditPhaseId(phaseId);
      const today = new Date();
      const weekLater = new Date(today);
      weekLater.setDate(weekLater.getDate() + 7);
      const startIso = today.toISOString().slice(0, 10);
      const endIso = weekLater.toISOString().slice(0, 10);
      setEditStart(ph.startDate ?? startIso);
      setEditEnd(ph.endDate ?? endIso);
      setEditColor(ph.color ?? "#217346");
      setEditOpen(true);
    },
    [plan.metadata.phases]
  );
  const saveEdit = useCallback(() => {
    if (!editPhaseId) return;
    dispatch(
      updatePhase({
        planId: plan.id,
        phaseId: editPhaseId,
        changes: { startDate: editStart, endDate: editEnd, color: editColor },
      })
    );
    setEditOpen(false);
  }, [dispatch, plan.id, editPhaseId, editStart, editEnd, editColor]);

  return (
    <Card variant="outlined" className="mb-6">
      <PlanHeader
        name={metadata.name}
        status={metadata.status}
        description={metadata.description}
        expanded={expanded}
        onToggleExpanded={() =>
          dispatch(setPlanExpanded({ planId: plan.id, expanded: !expanded }))
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <ResizableSplit
            leftPercent={leftPercent}
            onLeftPercentChange={(v) => {
              setLeftPercent(v);
              dispatch(setPlanLeftPercent({ planId: plan.id, percent: v }));
            }}
            left={
              <div className="grid grid-cols-1 gap-4">
                <CommonDataCard
                  owner={metadata.owner}
                  startDate={metadata.startDate}
                  endDate={metadata.endDate}
                  id={metadata.id}
                />
              </div>
            }
            right={
              <GanttChart
                startDate={metadata.startDate}
                endDate={metadata.endDate}
                tasks={tasks}
                phases={metadata.phases}
                hideMainCalendar
                onAddPhase={() => setPhaseOpen(true)}
                onEditPhase={openEdit}
                onPhaseRangeChange={(phaseId, s, e) =>
                  dispatch(
                    updatePhase({
                      planId: plan.id,
                      phaseId,
                      changes: { startDate: s, endDate: e },
                    })
                  )
                }
              />
            }
          />
        </CardContent>
      </Collapse>
      <AddPhaseDialog
        open={phaseOpen}
        onClose={() => setPhaseOpen(false)}
        onSubmit={(name) => {
          dispatch(addPhase({ planId: plan.id, name }));
        }}
      />
      <PhaseEditDialog
        open={editOpen}
        start={editStart}
        end={editEnd}
        color={editColor}
        onStartChange={setEditStart}
        onEndChange={setEditEnd}
        onColorChange={setEditColor}
        onCancel={() => setEditOpen(false)}
        onSave={saveEdit}
      />
    </Card>
  );
}
