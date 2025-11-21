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
  phaseOpen: boolean;
  setPhaseOpen: (open: boolean) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  editingPhase: PlanPhase | null;
  metadata: Plan["metadata"];
  handleAddPhaseOptimized: (phases: PlanPhase[]) => void;
  onPhaseSave: (updatedPhase: PlanPhase) => void;
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
  phaseOpen,
  setPhaseOpen,
  editOpen,
  setEditOpen,
  editingPhase,
  metadata,
  handleAddPhaseOptimized,
  onPhaseSave,
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
        planPhases={metadata.phases || []}
        onCancel={() => setEditOpen(false)}
        onSave={onPhaseSave}
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

