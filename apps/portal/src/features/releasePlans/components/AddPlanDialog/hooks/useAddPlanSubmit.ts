import { useState, useCallback } from "react";
import { getErrorMessage } from "../../../../../utils/notifications/errorNotification";

interface UseAddPlanSubmitProps {
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  productId: string;
  onSubmit: (
    name: string,
    description: string,
    status: string,
    startDate: string,
    endDate: string,
    productId: string
  ) => Promise<void>;
  resetForm: () => void;
  onClose: () => void;
  validateForm: () => string | null;
}

export function useAddPlanSubmit({
  name,
  description,
  status,
  startDate,
  endDate,
  productId,
  onSubmit,
  resetForm,
  onClose,
  validateForm,
}: UseAddPlanSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(
        name.trim(),
        description.trim(),
        status,
        startDate,
        endDate,
        productId
      );
      resetForm();
      onClose();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name,
    description,
    status,
    startDate,
    endDate,
    productId,
    onSubmit,
    resetForm,
    onClose,
    validateForm,
  ]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetForm();
    setError(null);
    setIsSubmitting(false);
    onClose();
  }, [isSubmitting, resetForm, onClose]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSubmitting,
    error,
    handleSubmit,
    handleClose,
    clearError,
  };
}

