import { useState } from "react";
import type { PlanPhase } from "../../../../types";

export function usePhaseValidation() {
  const [errors, setErrors] = useState<{
    name?: string;
    dateRange?: string;
  }>({});

  const validate = (formData: Partial<PlanPhase>) => {
    const newErrors: typeof errors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Phase name is required";
    }

    if (formData.startDate && formData.endDate) {
      if (formData.endDate < formData.startDate) {
        newErrors.dateRange =
          "End date must be after or equal to start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: "name" | "dateRange") => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return { errors, validate, clearError, setErrors };
}

