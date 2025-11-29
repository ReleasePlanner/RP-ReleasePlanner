import { useMemo, useCallback } from "react";
import type { PlanPhase } from "../../../../types";
import type { PhaseFormData, PhaseFormErrors } from "./usePhaseForm";

export function usePhaseValidation(
  open: boolean,
  formData: PhaseFormData,
  phase: PlanPhase | null,
  planPhases: PlanPhase[],
  basePhases: Array<{ name: string; color: string }>,
  setError: (field: keyof PhaseFormErrors, error?: string) => void,
  setErrorsState: (errors: Partial<PhaseFormErrors>) => void
) {
  // Check if phase is a base phase
  const isBasePhase = useMemo(() => {
    if (!open || !phase) return false;
    return basePhases.some(
      (bp) => bp.name === phase.name && bp.color === phase.color
    );
  }, [phase, basePhases, open]);

  // Validate phase name
  const validatePhaseName = useCallback(
    (name: string): boolean => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError("name", "Phase name is required");
        return false;
      }

      setError("name");
      return true;
    },
    [setError]
  );

  // Validate color
  const validateColor = useCallback(
    (color: string): boolean => {
      setError("color");
      return true;
    },
    [setError]
  );

  // Validate dates
  const validateDates = useCallback((): boolean => {
    const dateErrors: Partial<PhaseFormErrors> = {};

    if (!formData.startDate || formData.startDate.trim() === "") {
      dateErrors.startDate = "Start date is required";
    }

    if (!formData.endDate || formData.endDate.trim() === "") {
      dateErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate.trim() !== "" &&
      formData.endDate.trim() !== ""
    ) {
      if (formData.endDate < formData.startDate) {
        dateErrors.dateRange = "End date must be after or equal to start date";
      }
    }

    // Update errors state
    setErrorsState({
      startDate: dateErrors.startDate,
      endDate: dateErrors.endDate,
      dateRange: dateErrors.dateRange,
    });

    return Object.keys(dateErrors).length === 0;
  }, [formData.startDate, formData.endDate, setErrorsState]);

  // Validate base phase (only dates)
  const validateBasePhase = useCallback((): boolean => {
    const datesValid = validateDates();
    if (!datesValid) return false;

    if (formData.startDate && formData.endDate) {
      return true;
    }

    setErrorsState({
      startDate: formData.startDate ? undefined : "Start date is required",
      endDate: formData.endDate ? undefined : "End date is required",
    });
    return false;
  }, [formData.startDate, formData.endDate, validateDates, setErrorsState]);

  // Validate local phase (all fields)
  const validateLocalPhase = useCallback((): boolean => {
    const nameValid = validatePhaseName(formData.name.trim());
    const colorValid = validateColor(formData.color);
    const datesValid = validateDates();

    if (!nameValid || !colorValid || !datesValid) {
      return false;
    }

    const hasName = formData.name.trim();
    const hasStartDate = formData.startDate;
    const hasEndDate = formData.endDate;

    if (hasName && hasStartDate && hasEndDate) {
      return true;
    }

    setErrorsState({
      name: hasName ? undefined : "Phase name is required",
      startDate: hasStartDate ? undefined : "Start date is required",
      endDate: hasEndDate ? undefined : "End date is required",
    });
    return false;
  }, [
    formData.name,
    formData.color,
    formData.startDate,
    formData.endDate,
    validatePhaseName,
    validateColor,
    validateDates,
    setErrorsState,
  ]);

  return {
    isBasePhase,
    validatePhaseName,
    validateColor,
    validateDates,
    validateBasePhase,
    validateLocalPhase,
  };
}
