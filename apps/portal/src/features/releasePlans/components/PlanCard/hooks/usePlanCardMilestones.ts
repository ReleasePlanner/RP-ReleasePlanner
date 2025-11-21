import { useState, useCallback } from "react";
import type { PlanMilestone, Plan } from "../../../types";

export function usePlanCardMilestones(
  metadata: Plan["metadata"],
  setLocalMetadata: React.Dispatch<React.SetStateAction<Plan["metadata"]>>
) {
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [selectedMilestoneDate, setSelectedMilestoneDate] = useState<
    string | null
  >(null);
  const [editingMilestone, setEditingMilestone] =
    useState<PlanMilestone | null>(null);

  const handleMilestoneAdd = useCallback((milestone: PlanMilestone) => {
    setSelectedMilestoneDate(milestone.date);
    setEditingMilestone(null);
    setMilestoneDialogOpen(true);
  }, []);

  const handleMilestoneUpdate = useCallback((milestone: PlanMilestone) => {
    setSelectedMilestoneDate(milestone.date);
    setEditingMilestone(milestone);
    setMilestoneDialogOpen(true);
  }, []);

  const handleMilestoneDelete = useCallback(
    (milestoneId: string) => {
      const updatedMilestones =
        metadata.milestones?.filter((m) => m.id !== milestoneId) || [];
      setLocalMetadata((prev) => ({
        ...prev,
        milestones: updatedMilestones,
      }));
    },
    [metadata.milestones, setLocalMetadata]
  );

  const handleMilestoneSave = useCallback(
    (milestone: PlanMilestone) => {
      const existingMilestones = metadata.milestones || [];
      const existingIndex = existingMilestones.findIndex(
        (m) => m.id === milestone.id
      );

      const updatedMilestones =
        existingIndex >= 0
          ? existingMilestones.map((m, idx) =>
              idx === existingIndex ? milestone : m
            )
          : [...existingMilestones, milestone];

      setLocalMetadata((prev) => ({
        ...prev,
        milestones: updatedMilestones,
      }));
    },
    [metadata.milestones, setLocalMetadata]
  );

  const handleMilestoneDialogClose = useCallback(() => {
    setMilestoneDialogOpen(false);
    setSelectedMilestoneDate(null);
    setEditingMilestone(null);
  }, []);

  return {
    milestoneDialogOpen,
    selectedMilestoneDate,
    editingMilestone,
    handleMilestoneAdd,
    handleMilestoneUpdate,
    handleMilestoneDelete,
    handleMilestoneSave,
    handleMilestoneDialogClose,
  };
}

