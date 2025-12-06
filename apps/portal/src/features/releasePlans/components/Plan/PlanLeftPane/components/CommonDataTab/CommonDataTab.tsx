import { Box, Stack } from "@mui/material";
import { useLocalState, usePlanCalculations } from "../../hooks";
import { PlanNameField } from "./fields/PlanNameField";
import { DescriptionField } from "./fields/DescriptionField";
import { StatusField } from "./fields/StatusField";
import { PeriodField } from "./fields/PeriodField";
import type { PlanStatus } from "../../../../../types";

export type CommonDataTabProps = {
  readonly name: string;
  readonly description?: string;
  readonly status: PlanStatus;
  readonly startDate: string;
  readonly endDate: string;
  readonly teamIds?: string[];
  readonly onNameChange?: (name: string) => void;
  readonly onDescriptionChange?: (description: string) => void;
  readonly onStatusChange?: (status: PlanStatus) => void;
  readonly onStartDateChange?: (date: string) => void;
  readonly onEndDateChange?: (date: string) => void;
};

export function CommonDataTab({
  name,
  description,
  status,
  startDate,
  endDate,
  teamIds = [],
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
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
    nameTimeoutRef,
    descriptionTimeoutRef,
    startDateTimeoutRef,
    endDateTimeoutRef,
    originalNameRef,
    originalDescriptionRef,
    originalStatusRef,
    originalStartDateRef,
    originalEndDateRef,
  } = useLocalState(
    name,
    description,
    status,
    startDate,
    endDate,
    undefined, // productId - moved to Product tab
    undefined, // itOwner - moved to Product tab
    undefined // leadId - moved to Product tab
  );

  // Calculations hook
  const { duration, formattedDateRange } = usePlanCalculations(
    localStartDate,
    localEndDate
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
      </Stack>
    </Box>
  );
}

