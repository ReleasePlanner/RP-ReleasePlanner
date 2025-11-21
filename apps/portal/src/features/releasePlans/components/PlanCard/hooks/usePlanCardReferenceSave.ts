import { useCallback } from "react";
import type { PlanReference, Plan } from "../../../types";

export function usePlanCardReferenceSave(
  metadata: Plan["metadata"],
  setLocalMetadata: React.Dispatch<React.SetStateAction<Plan["metadata"]>>,
  handleReferenceDialogClose: () => void
) {
  const handleSaveReference = useCallback(
    (reference: PlanReference) => {
      const existingReferences = metadata.references || [];
      const updatedReferences = [...existingReferences, reference];

      setLocalMetadata((prev) => ({
        ...prev,
        references: updatedReferences,
      }));

      handleReferenceDialogClose();
    },
    [
      metadata.references,
      setLocalMetadata,
      handleReferenceDialogClose,
    ]
  );

  return { handleSaveReference };
}

