import { useCallback, useMemo, useState, useEffect } from "react";
import { Box, Tabs, Tab, useTheme, alpha } from "@mui/material";
import { useAppSelector } from "../../../../../store/hooks";
import type { PlanPhase } from "../../../types";
import { BaseEditDialog } from "../../../../../components/BaseEditDialog";
import type { RootState } from "../../../../../store/store";
import {
  usePhaseForm,
  usePhaseValidation,
  usePhaseFormValidation,
} from "./hooks";
import {
  PhaseCommonDataTab,
  PhaseMetricsTab,
  PhaseReschedulesTab,
} from "./components";

export type PhaseEditDialogProps = {
  readonly open: boolean;
  readonly phase: PlanPhase | null;
  readonly planId?: string; // Plan ID for fetching reschedules
  readonly planPhases?: PlanPhase[]; // All phases in the current plan
  readonly indicatorIds?: string[]; // IDs of indicators assigned to the plan
  readonly originalPhase?: PlanPhase | null; // Fase original desde el plan (para comparar cambios)
  readonly onCancel: () => void;
  readonly onSave: (phase: PlanPhase) => void;
  readonly onSaveMetrics?: (phaseId: string, metricValues: Record<string, string>) => Promise<void>;
};

export default function PhaseEditDialog({
  open,
  phase,
  planId,
  planPhases = [],
  indicatorIds = [],
  originalPhase,
  onCancel,
  onSave,
  onSaveMetrics,
}: PhaseEditDialogProps) {
  const theme = useTheme();
  const basePhases = useAppSelector(
    (state: RootState) => state.basePhases.phases
  );
  const isNew = !phase?.id || phase.id.startsWith("new-");
  const [tabValue, setTabValue] = useState(0);
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [hasMetricsChanges, setHasMetricsChanges] = useState(false);

  // Form state management
  const {
    formData,
    errors,
    hasInteracted,
    updateField,
    setError,
    setErrorsState,
    convertToUTC,
  } = usePhaseForm(open, phase);

  // Validation logic
  const {
    isBasePhase,
    validatePhaseName,
    validateColor,
    validateDates,
    validateBasePhase,
    validateLocalPhase,
  } = usePhaseValidation(
    open,
    formData,
    phase,
    planPhases,
    basePhases,
    setError,
    setErrorsState
  );

  // Auto-validation with debounce
  const { isValidating } = usePhaseFormValidation(
    open,
    formData,
    hasInteracted,
    validatePhaseName,
    validateColor,
    validateDates
  );

  // Form validity check
  const isFormValid = useMemo(() => {
    const hasDateErrors = !!(
      errors.startDate ||
      errors.endDate ||
      errors.dateRange
    );

    if (isBasePhase) {
      return (
        formData.startDate !== "" && formData.endDate !== "" && !hasDateErrors
      );
    }

    const hasOtherErrors = !!(errors.name || errors.color);
    return (
      formData.name.trim() !== "" &&
      formData.startDate !== "" &&
      formData.endDate !== "" &&
      !hasDateErrors &&
      !hasOtherErrors &&
      !isValidating
    );
  }, [formData, errors, isValidating, isBasePhase]);

  // Track changes in Common Data tab
  const hasCommonDataChanges = useMemo(() => {
    if (!phase) return false;
    return (
      formData.name.trim() !== (phase.name || "") ||
      formData.startDate !== (phase.startDate || "") ||
      formData.endDate !== (phase.endDate || "") ||
      formData.color !== (phase.color || "#185ABD")
    );
  }, [phase, formData]);

  // Helper: Validate and convert dates
  const validateAndConvertDates = useCallback((): {
    startDateUTC: string;
    endDateUTC: string;
    isValid: boolean;
  } => {
    const { startDateUTC, endDateUTC } = convertToUTC();

    if (startDateUTC && endDateUTC) {
      return { startDateUTC, endDateUTC, isValid: true };
    }

    setErrorsState({
      startDate: startDateUTC ? undefined : "Invalid start date",
      endDate: endDateUTC ? undefined : "Invalid end date",
    });
    return { startDateUTC, endDateUTC, isValid: false };
  }, [convertToUTC, setErrorsState]);

  // Helper: Create saved phase object
  const createSavedPhase = useCallback(
    (startDateUTC: string, endDateUTC: string): PlanPhase => {
      return {
        id: phase?.id || `phase-${Date.now()}`,
        name: isBasePhase ? phase?.name || "" : formData.name.trim(),
        startDate: startDateUTC,
        endDate: endDateUTC,
        color: isBasePhase ? phase?.color || "#185ABD" : formData.color,
      };
    },
    [phase, isBasePhase, formData.name, formData.color]
  );

  // Helper: Validate saved phase has all required fields
  const validateSavedPhase = useCallback(
    (savedPhase: PlanPhase): boolean => {
      if (savedPhase.name && savedPhase.startDate && savedPhase.endDate) {
        return true;
      }

      setErrorsState({
        name: savedPhase.name ? undefined : "Phase name is required",
        startDate: savedPhase.startDate ? undefined : "Start date is required",
        endDate: savedPhase.endDate ? undefined : "End date is required",
      });
      return false;
    },
    [setErrorsState]
  );

  // Save handler for Common Data tab - independent, atomic save
  const handleSave = useCallback(async () => {
    // Validate based on phase type
    const isValid = isBasePhase ? validateBasePhase() : validateLocalPhase();
    if (!isValid) return;

    // Convert dates to UTC and validate
    const {
      startDateUTC,
      endDateUTC,
      isValid: datesValid,
    } = validateAndConvertDates();
    if (!datesValid) return;

    // Create saved phase
    const savedPhase = createSavedPhase(startDateUTC, endDateUTC);

    // Final validation
    if (!validateSavedPhase(savedPhase)) return;

    // Save phase data (atomic operation)
    try {
      onSave(savedPhase);
      // Don't close dialog - allow user to continue editing or switch tabs
    } catch (error) {
      console.error("[PhaseEditDialog] Error saving phase:", error);
    }
  }, [
    isBasePhase,
    validateBasePhase,
    validateLocalPhase,
    validateAndConvertDates,
    createSavedPhase,
    validateSavedPhase,
    onSave,
  ]);

  // Load metricValues when phase changes
  useEffect(() => {
    if (phase?.metricValues) {
      setMetricValues(phase.metricValues);
    } else {
      setMetricValues({});
    }
  }, [phase?.metricValues]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTabValue(0);
      setMetricValues({});
      setHasMetricsChanges(false);
    }
  }, [open]);

  // Handle metric value changes
  const handleMetricValueChange = useCallback(
    (indicatorId: string, value: string) => {
      setMetricValues((prev) => {
        const updated = { ...prev, [indicatorId]: value };
        setHasMetricsChanges(true);
        return updated;
      });
    },
    []
  );

  // Handle save metrics
  const handleSaveMetrics = useCallback(async () => {
    if (!phase?.id || !onSaveMetrics) return;

    setIsSavingMetrics(true);
    try {
      await onSaveMetrics(phase.id, metricValues);
      setHasMetricsChanges(false);
    } catch (error) {
      console.error("[PhaseEditDialog] Error saving metrics:", error);
    } finally {
      setIsSavingMetrics(false);
    }
  }, [phase?.id, metricValues, onSaveMetrics]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isFormValid && tabValue === 0) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [isFormValid, handleSave, onCancel, tabValue]
  );

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  return (
    <BaseEditDialog
      open={open}
      onClose={onCancel}
      editing={!isNew}
      title={isNew ? "New Phase" : "Edit Phase"}
      subtitle={
        isBasePhase
          ? "Standard maintenance phase - You can only edit dates"
          : "Modify phase details"
      }
      subtitleChip={isBasePhase ? "Base Phase" : undefined}
      maxWidth="md"
      fullWidth={true}
      onSave={tabValue === 0 ? handleSave : handleSaveMetrics}
      saveButtonText={
        tabValue === 0
          ? "Save Changes"
          : isSavingMetrics
          ? "Saving..."
          : "Save Metrics"
      }
      cancelButtonText="Cancel"
      isFormValid={tabValue === 0 ? isFormValid : hasMetricsChanges}
      saveButtonDisabled={
        tabValue === 0 ? !isFormValid : !hasMetricsChanges || isSavingMetrics
      }
      showDefaultActions={true}
    >
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 48,
            },
          }}
        >
          <Tab label="Common Data" id="phase-tab-0" aria-controls="phase-tabpanel-0" />
          <Tab label="Metrics" id="phase-tab-1" aria-controls="phase-tabpanel-1" />
          {!isNew && phase?.id && planId && (
            <Tab label="Re-schedules" id="phase-tab-2" aria-controls="phase-tabpanel-2" />
          )}
        </Tabs>

        <Box
          role="tabpanel"
          hidden={tabValue !== 0}
          id="phase-tabpanel-0"
          aria-labelledby="phase-tab-0"
        >
          {tabValue === 0 && (
            <PhaseCommonDataTab
              isBasePhase={isBasePhase}
              phaseName={phase?.name}
              phaseColor={phase?.color}
              formData={formData}
              errors={errors}
              isValidating={isValidating}
              hasInteracted={hasInteracted}
              isFormValid={isFormValid}
              isSaving={false}
              hasPendingChanges={hasCommonDataChanges}
              onNameChange={(value) => updateField("name", value)}
              onStartDateChange={(value) => updateField("startDate", value)}
              onEndDateChange={(value) => updateField("endDate", value)}
              onColorChange={(value) => updateField("color", value)}
              onKeyDown={handleKeyDown}
              onSave={handleSave}
            />
          )}
        </Box>

        <Box
          role="tabpanel"
          hidden={tabValue !== 1}
          id="phase-tabpanel-1"
          aria-labelledby="phase-tab-1"
        >
          {tabValue === 1 && phase?.id && (
            <PhaseMetricsTab
              indicatorIds={indicatorIds}
              phaseId={phase.id}
              metricValues={metricValues}
              onMetricValueChange={handleMetricValueChange}
              isSaving={isSavingMetrics}
              hasPendingChanges={hasMetricsChanges}
              onSave={handleSaveMetrics}
            />
          )}
        </Box>

        {!isNew && phase?.id && planId && (
          <Box
            role="tabpanel"
            hidden={tabValue !== 2}
            id="phase-tabpanel-2"
            aria-labelledby="phase-tab-2"
            sx={{ width: "100%" }}
          >
            {tabValue === 2 && planId && phase.id && (
              <PhaseReschedulesTab
                planId={planId}
                phaseId={phase.id}
                originalPhase={originalPhase}
                currentPhase={phase}
              />
            )}
          </Box>
        )}
      </Box>
    </BaseEditDialog>
  );
}
