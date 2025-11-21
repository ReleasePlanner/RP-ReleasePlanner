import { Dialog } from "@mui/material";
import { useProducts } from "../../../../api/hooks";
import { useAddPlanForm } from "./hooks/useAddPlanForm";
import { useAddPlanValidation } from "./hooks/useAddPlanValidation";
import { useAddPlanSubmit } from "./hooks/useAddPlanSubmit";
import { AddPlanDialogTitle } from "./components/AddPlanDialogTitle";
import { AddPlanDialogContent } from "./components/AddPlanDialogContent";
import { AddPlanDialogActions } from "./components/AddPlanDialogActions";

export interface AddPlanDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (
    name: string,
    description: string,
    status: string,
    startDate: string,
    endDate: string,
    productId: string
  ) => Promise<void>;
}

export default function AddPlanDialog({
  open,
  onClose,
  onSubmit,
}: AddPlanDialogProps) {
  const { data: products = [] } = useProducts();

  const {
    name,
    setName,
    description,
    setDescription,
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    productId,
    setProductId,
    resetForm,
  } = useAddPlanForm(open);

  const { isFormValid, validateForm } = useAddPlanValidation({
    name,
    status,
    startDate,
    endDate,
    productId,
  });

  const { isSubmitting, error, handleSubmit, handleClose, clearError } =
    useAddPlanSubmit({
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
    });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      <AddPlanDialogTitle />

      <AddPlanDialogContent
        name={name}
        description={description}
        status={status}
        startDate={startDate}
        endDate={endDate}
        productId={productId}
        products={products}
        error={error}
        isSubmitting={isSubmitting}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onStatusChange={setStatus}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onProductIdChange={setProductId}
        onErrorClear={clearError}
      />

      <AddPlanDialogActions
        isFormValid={isFormValid}
        isSubmitting={isSubmitting}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
}

