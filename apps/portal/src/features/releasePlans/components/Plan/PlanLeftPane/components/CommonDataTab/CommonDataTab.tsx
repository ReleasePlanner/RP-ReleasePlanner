import { Box, Stack } from "@mui/material";
import { useLocalState, usePlanCalculations, useFieldValidation } from "../../hooks";
import { useITOwners, useProducts } from "@/api/hooks";
import { PlanNameField } from "./fields/PlanNameField";
import { DescriptionField } from "./fields/DescriptionField";
import { StatusField } from "./fields/StatusField";
import { PeriodField } from "./fields/PeriodField";
import { ProductField } from "./fields/ProductField";
import { ITOwnerField } from "./fields/ITOwnerField";
import { LeadField } from "./fields/LeadField";
import { usePlanTalents } from "./hooks/usePlanTalents";
import type { PlanStatus } from "../../../../../types";

export type CommonDataTabProps = {
  readonly name: string;
  readonly description?: string;
  readonly status: PlanStatus;
  readonly startDate: string;
  readonly endDate: string;
  readonly productId?: string;
  readonly originalProductId?: string;
  readonly itOwner?: string;
  readonly leadId?: string;
  readonly teamIds?: string[];
  readonly onNameChange?: (name: string) => void;
  readonly onDescriptionChange?: (description: string) => void;
  readonly onStatusChange?: (status: PlanStatus) => void;
  readonly onStartDateChange?: (date: string) => void;
  readonly onEndDateChange?: (date: string) => void;
  readonly onProductChange: (productId: string) => void;
  readonly onITOwnerChange?: (itOwnerId: string) => void;
  readonly onLeadIdChange?: (leadId: string) => void;
};

export function CommonDataTab({
  name,
  description,
  status,
  startDate,
  endDate,
  productId,
  originalProductId,
  itOwner,
  leadId,
  teamIds = [],
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onProductChange,
  onITOwnerChange,
  onLeadIdChange,
}: CommonDataTabProps) {
  // Local state hook
  const {
    localName,
    setLocalName,
    localDescription,
    setLocalDescription,
    localStatus,
    setLocalStatus,
    localStartDate,
    setLocalStartDate,
    localEndDate,
    setLocalEndDate,
    localProductId,
    setLocalProductId,
    localItOwner,
    setLocalItOwner,
    nameTimeoutRef,
    descriptionTimeoutRef,
    startDateTimeoutRef,
    endDateTimeoutRef,
    originalNameRef,
    originalDescriptionRef,
    originalStatusRef,
    originalStartDateRef,
    originalEndDateRef,
    originalProductIdRef,
    originalItOwnerRef,
    localLeadId,
    setLocalLeadId,
    originalLeadIdRef,
  } = useLocalState(
    name,
    description,
    status,
    startDate,
    endDate,
    productId,
    itOwner,
    leadId
  );

  // Calculations hook
  const { duration, formattedDateRange } = usePlanCalculations(
    localStartDate,
    localEndDate
  );

  // Data hooks
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: itOwners = [], isLoading: isLoadingITOwners } = useITOwners();
  const { talents, isLoading: isLoadingTalents } = usePlanTalents(teamIds);

  // Validation hook
  const { validProductId, validItOwner, validLeadId } = useFieldValidation(
    localProductId,
    localItOwner,
    localLeadId,
    products,
    itOwners,
    talents,
    isLoadingProducts,
    isLoadingITOwners,
    isLoadingTalents,
    onProductChange,
    onITOwnerChange,
    onLeadIdChange
  );

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={1.5} sx={{ width: "100%" }}>
        <PlanNameField
          value={localName}
          onChange={(newValue) => {
            setLocalName(newValue);
            if (nameTimeoutRef.current) {
              clearTimeout(nameTimeoutRef.current);
            }
            nameTimeoutRef.current = setTimeout(() => {
              if (onNameChange && newValue !== name) {
                onNameChange(newValue);
              }
            }, 100);
          }}
          onBlur={(value) => {
            if (nameTimeoutRef.current) {
              clearTimeout(nameTimeoutRef.current);
              nameTimeoutRef.current = null;
            }
            if (onNameChange && value !== name) {
              onNameChange(value);
            }
          }}
        />

        <DescriptionField
          value={localDescription}
          onChange={(newValue) => {
            setLocalDescription(newValue);
            if (descriptionTimeoutRef.current) {
              clearTimeout(descriptionTimeoutRef.current);
            }
            descriptionTimeoutRef.current = setTimeout(() => {
              if (onDescriptionChange && newValue !== description) {
                onDescriptionChange(newValue);
              }
            }, 100);
          }}
          onBlur={(value) => {
            if (descriptionTimeoutRef.current) {
              clearTimeout(descriptionTimeoutRef.current);
              descriptionTimeoutRef.current = null;
            }
            if (onDescriptionChange && value !== description) {
              onDescriptionChange(value);
            }
          }}
        />

        <StatusField
          value={localStatus}
          onChange={(newValue) => {
            setLocalStatus(newValue);
            if (onStatusChange && newValue !== status) {
              onStatusChange(newValue);
            }
          }}
        />

        <PeriodField
          startDate={localStartDate}
          endDate={localEndDate}
          formattedDateRange={formattedDateRange}
          duration={duration}
          onStartDateChange={(newValue) => {
            setLocalStartDate(newValue);
            if (startDateTimeoutRef.current) {
              clearTimeout(startDateTimeoutRef.current);
            }
            startDateTimeoutRef.current = setTimeout(() => {
              if (onStartDateChange && newValue !== startDate) {
                onStartDateChange(newValue);
              }
            }, 100);
          }}
          onEndDateChange={(newValue) => {
            setLocalEndDate(newValue);
            if (endDateTimeoutRef.current) {
              clearTimeout(endDateTimeoutRef.current);
            }
            endDateTimeoutRef.current = setTimeout(() => {
              if (onEndDateChange && newValue !== endDate) {
                onEndDateChange(newValue);
              }
            }, 100);
          }}
          onStartDateBlur={(value) => {
            if (startDateTimeoutRef.current) {
              clearTimeout(startDateTimeoutRef.current);
              startDateTimeoutRef.current = null;
            }
            if (onStartDateChange && value !== startDate) {
              onStartDateChange(value);
            }
          }}
          onEndDateBlur={(value) => {
            if (endDateTimeoutRef.current) {
              clearTimeout(endDateTimeoutRef.current);
              endDateTimeoutRef.current = null;
            }
            if (onEndDateChange && value !== endDate) {
              onEndDateChange(value);
            }
          }}
        />

        <ProductField
          originalProductId={originalProductId}
          products={products}
          validProductId={validProductId}
          localProductId={localProductId}
          onProductChange={(newValue) => {
            setLocalProductId(newValue || undefined);
            if (onProductChange && newValue !== productId) {
              onProductChange(newValue);
            }
          }}
        />

        <ITOwnerField
          itOwners={itOwners}
          validItOwner={validItOwner}
          localItOwner={localItOwner}
          isLoadingITOwners={isLoadingITOwners}
          onITOwnerChange={(newValue) => {
            setLocalItOwner(newValue || undefined);
            if (onITOwnerChange && newValue !== itOwner) {
              onITOwnerChange(newValue);
            }
          }}
        />

        <LeadField
          talents={talents}
          validLeadId={validLeadId}
          localLeadId={localLeadId}
          isLoadingTalents={isLoadingTalents}
          onLeadIdChange={(newValue) => {
            setLocalLeadId(newValue || undefined);
            if (onLeadIdChange && newValue !== leadId) {
              onLeadIdChange(newValue);
            }
          }}
        />
      </Stack>
    </Box>
  );
}

