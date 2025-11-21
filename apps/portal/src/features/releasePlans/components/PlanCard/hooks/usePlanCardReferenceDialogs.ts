import { useState, useCallback, useMemo } from "react";
import type { PlanReference, PlanReferenceType, Plan } from "../../../types";

export function usePlanCardReferenceDialogs(metadata: Plan["metadata"]) {
  const [referenceDialogOpen, setReferenceDialogOpen] = useState(false);
  const [editingReference, setEditingReference] =
    useState<PlanReference | null>(null);
  const [isCreatingReference, setIsCreatingReference] = useState(false);
  const [prefilledReferenceData, setPrefilledReferenceData] = useState<{
    type?: PlanReferenceType;
    phaseId?: string;
    date?: string;
  } | null>(null);

  const handleAddCellComment = useCallback((phaseId: string, date: string) => {
    setPrefilledReferenceData({
      type: "note",
      phaseId: phaseId || undefined,
      date,
    });
    setEditingReference(null);
    setIsCreatingReference(true);
    setReferenceDialogOpen(true);
  }, []);

  const handleAddCellFile = useCallback((phaseId: string, date: string) => {
    setPrefilledReferenceData({
      type: "document",
      phaseId: phaseId || undefined,
      date,
    });
    setEditingReference(null);
    setIsCreatingReference(true);
    setReferenceDialogOpen(true);
  }, []);

  const handleAddCellLink = useCallback((phaseId: string, date: string) => {
    setPrefilledReferenceData({
      type: "link",
      phaseId: phaseId || undefined,
      date,
    });
    setEditingReference(null);
    setIsCreatingReference(true);
    setReferenceDialogOpen(true);
  }, []);

  const handleToggleCellMilestone = useCallback(
    (phaseId: string, date: string) => {
      setPrefilledReferenceData({
        type: "milestone",
        phaseId: phaseId || undefined,
        date,
      });
      setEditingReference(null);
      setIsCreatingReference(true);
      setReferenceDialogOpen(true);
    },
    []
  );

  const handleReferenceDialogClose = useCallback(() => {
    setReferenceDialogOpen(false);
    setEditingReference(null);
    setIsCreatingReference(false);
    setPrefilledReferenceData(null);
  }, []);

  const referenceForDialog = useMemo(() => {
    // Create a temporary reference with prefilled data if creating new reference
    if (isCreatingReference && prefilledReferenceData) {
      return {
        id: `temp-${Date.now()}`,
        type: prefilledReferenceData.type || "link",
        title: "",
        createdAt: new Date().toISOString(),
        date: prefilledReferenceData.date,
        phaseId: prefilledReferenceData.phaseId,
        ...(prefilledReferenceData.type === "milestone" && {
          milestoneColor: "#F44336",
        }),
      } as PlanReference;
    }
    return editingReference;
  }, [isCreatingReference, prefilledReferenceData, editingReference]);

  return {
    referenceDialogOpen,
    editingReference,
    isCreatingReference,
    prefilledReferenceData,
    referenceForDialog,
    handleAddCellComment,
    handleAddCellFile,
    handleAddCellLink,
    handleToggleCellMilestone,
    handleReferenceDialogClose,
    setEditingReference,
    setIsCreatingReference,
    setPrefilledReferenceData,
  };
}

