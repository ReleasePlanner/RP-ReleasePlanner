import { useMemo } from "react";

interface UseAddPlanValidationProps {
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  productId: string;
}

export function useAddPlanValidation({
  name,
  status,
  startDate,
  endDate,
  productId,
}: UseAddPlanValidationProps) {
  const isFormValid = useMemo(
    () => Boolean(name.trim() && status && startDate && endDate && productId),
    [name, status, startDate, endDate, productId]
  );

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return "Plan name is required";
    }
    if (!status) {
      return "Status is required";
    }
    if (!startDate) {
      return "Start date is required";
    }
    if (!endDate) {
      return "End date is required";
    }
    if (!productId) {
      return "Product is required";
    }
    return null;
  };

  return {
    isFormValid,
    validateForm,
  };
}

