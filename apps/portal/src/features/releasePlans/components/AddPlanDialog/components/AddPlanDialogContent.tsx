import { DialogContent, Stack, Box, Typography, useTheme } from "@mui/material";
import { ErrorAlert } from "./ErrorAlert";
import { PlanNameField } from "./PlanNameField";
import { PlanStatusField } from "./PlanStatusField";
import { PlanDateFields } from "./PlanDateFields";
import { PlanProductField } from "./PlanProductField";
import { PlanDescriptionField } from "./PlanDescriptionField";
import type { PlanStatus } from "../../../types";

interface ProductWithId {
  id: string;
  name: string;
}

export type AddPlanDialogContentProps = {
  readonly name: string;
  readonly description: string;
  readonly status: PlanStatus;
  readonly startDate: string;
  readonly endDate: string;
  readonly productId: string;
  readonly products: ProductWithId[];
  readonly error: string | null;
  readonly isSubmitting: boolean;
  readonly onNameChange: (value: string) => void;
  readonly onDescriptionChange: (value: string) => void;
  readonly onStatusChange: (status: PlanStatus) => void;
  readonly onStartDateChange: (value: string) => void;
  readonly onEndDateChange: (value: string) => void;
  readonly onProductIdChange: (value: string) => void;
  readonly onErrorClear: () => void;
};

export function AddPlanDialogContent({
  name,
  description,
  status,
  startDate,
  endDate,
  productId,
  products,
  error,
  isSubmitting,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onProductIdChange,
  onErrorClear,
}: AddPlanDialogContentProps) {
  const theme = useTheme();

  return (
    <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
      <Stack spacing={3}>
        <ErrorAlert error={error} onClose={onErrorClear} />

        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: theme.palette.text.primary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Basic Information
          </Typography>
          <Stack spacing={2}>
            <PlanNameField
              name={name}
              error={error}
              isSubmitting={isSubmitting}
              onChange={onNameChange}
              onErrorClear={onErrorClear}
            />

            <PlanStatusField
              status={status}
              isSubmitting={isSubmitting}
              onChange={onStatusChange}
              onErrorClear={onErrorClear}
            />

            <PlanDateFields
              startDate={startDate}
              endDate={endDate}
              error={error}
              isSubmitting={isSubmitting}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
              onErrorClear={onErrorClear}
            />

            <PlanProductField
              productId={productId}
              products={products}
              error={error}
              isSubmitting={isSubmitting}
              onChange={onProductIdChange}
              onErrorClear={onErrorClear}
            />

            <PlanDescriptionField
              description={description}
              isSubmitting={isSubmitting}
              onChange={onDescriptionChange}
            />
          </Stack>
        </Box>
      </Stack>
    </DialogContent>
  );
}

