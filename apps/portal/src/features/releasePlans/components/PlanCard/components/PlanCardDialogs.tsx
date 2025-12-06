import { useMemo } from "react";
import type {
  Plan,
  PlanPhase,
  PlanMilestone,
  PlanReference,
} from "../../../types";
import AddPhaseDialog from "../../Plan/AddPhaseDialog";
import PhaseEditDialog from "../../Plan/PhaseEditDialog/PhaseEditDialog";
import { MilestoneEditDialog } from "../../Plan/MilestoneEditDialog";
import { ReferenceEditDialog } from "../../Plan/PlanReferencesTab/ReferenceEditDialog/ReferenceEditDialog";

export type PlanCardDialogsProps = {
  // Phase dialogs
  planId: string;
  phaseOpen: boolean;
  setPhaseOpen: (open: boolean) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  editingPhase: PlanPhase | null;
  metadata: Plan["metadata"];
  originalMetadata?: Plan["metadata"]; // Metadata original para comparar cambios
  handleAddPhaseOptimized: (phases: PlanPhase[]) => void;
  onPhaseSave: (updatedPhase: PlanPhase) => void;
  handleSaveTimeline: (phasesOverride?: Plan["metadata"]["phases"]) => Promise<void>;
  setLocalMetadata: React.Dispatch<React.SetStateAction<Plan["metadata"]>>;
  isEditingRef: React.MutableRefObject<boolean>;

  // Milestone dialog
  milestoneDialogOpen: boolean;
  selectedMilestoneDate: string | null;
  editingMilestone: PlanMilestone | null;
  handleMilestoneSave: (milestone: PlanMilestone) => void;
  handleMilestoneDelete: (milestoneId: string) => void;
  handleMilestoneDialogClose: () => void;

  // Reference dialog
  referenceDialogOpen: boolean;
  referenceForDialog: PlanReference | null;
  isCreatingReference: boolean;
  handleSaveReference: (reference: PlanReference) => void;
  handleReferenceDialogClose: () => void;
};

export function PlanCardDialogs({
  planId,
  phaseOpen,
  setPhaseOpen,
  editOpen,
  setEditOpen,
  editingPhase,
  metadata,
  originalMetadata,
  handleAddPhaseOptimized,
  onPhaseSave,
  handleSaveTimeline,
  setLocalMetadata,
  isEditingRef,
  milestoneDialogOpen,
  selectedMilestoneDate,
  editingMilestone,
  handleMilestoneSave,
  handleMilestoneDelete,
  handleMilestoneDialogClose,
  referenceDialogOpen,
  referenceForDialog,
  isCreatingReference,
  handleSaveReference,
  handleReferenceDialogClose,
}: PlanCardDialogsProps) {
  return (
    <>
      <AddPhaseDialog
        open={phaseOpen}
        onClose={() => setPhaseOpen(false)}
        onSubmit={handleAddPhaseOptimized}
        existingPhases={metadata.phases ?? []}
        planStartDate={metadata.startDate}
        planEndDate={metadata.endDate}
      />

      <PhaseEditDialog
        open={editOpen}
        phase={editingPhase}
        planId={planId}
        planPhases={metadata.phases || []}
        indicatorIds={metadata.indicatorIds || []}
        originalPhase={
          editingPhase?.id && originalMetadata?.phases
            ? originalMetadata.phases.find((p) => p.id === editingPhase.id) || null
            : null
        }
        onCancel={() => setEditOpen(false)}
        onSave={onPhaseSave}
        onSaveMetrics={async (phaseId, metricValues) => {
          console.log("[PlanCardDialogs] Saving metrics for phase to memory:", {
            phaseId,
            metricValues,
          });

          // ⚡ DISCONNECTED OBJECTS PATTERN: Only update in memory, don't persist
          // The main SAVE button will persist all changes atomically
          setLocalMetadata((prev) => {
            // Ensure prev.phases is always an array
            const prevPhases = Array.isArray(prev.phases) ? prev.phases : [];
            const updatedPhases = prevPhases.map((p) =>
              p.id === phaseId ? { ...p, metricValues } : p
            );
            
            console.log("[PlanCardDialogs] Updated phases with metricValues in memory:", {
              phaseId,
              prevPhasesType: typeof prev.phases,
              prevPhasesIsArray: Array.isArray(prev.phases),
              prevPhasesLength: prevPhases.length,
              updatedPhase: updatedPhases.find((p) => p.id === phaseId),
              allPhases: updatedPhases.map((p) => ({
                id: p.id,
                name: p.name,
                hasMetricValues: !!p.metricValues,
                metricValues: p.metricValues,
              })),
            });
            
            return {
              ...prev,
              phases: updatedPhases,
            };
          });
        }}
      />

      <MilestoneEditDialog
        open={milestoneDialogOpen}
        date={selectedMilestoneDate}
        milestone={editingMilestone}
        onClose={handleMilestoneDialogClose}
        onSave={handleMilestoneSave}
        onDelete={handleMilestoneDelete}
      />

      <ReferenceEditDialog
        open={referenceDialogOpen}
        reference={referenceForDialog}
        isCreating={isCreatingReference}
        onClose={handleReferenceDialogClose}
        onSave={handleSaveReference}
        phases={metadata.phases || []}
        startDate={metadata.startDate}
        endDate={metadata.endDate}
        calendarIds={metadata.calendarIds || []}
      />
    </>
  );
}

