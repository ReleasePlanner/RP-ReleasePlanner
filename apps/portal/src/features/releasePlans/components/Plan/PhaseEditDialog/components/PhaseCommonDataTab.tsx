import { Box, Stack, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import type { PlanPhase } from "../../../../types";
import { PhaseNameField, PhaseDateFields, PhaseColorField } from "./index";
import type { PhaseFormData, PhaseFormErrors } from "../hooks/usePhaseForm";

export type PhaseCommonDataTabProps = {
  readonly isBasePhase: boolean;
  readonly phaseName?: string;
  readonly phaseColor?: string;
  readonly formData: PhaseFormData;
  readonly errors: PhaseFormErrors;
  readonly isValidating: boolean;
  readonly hasInteracted: boolean;
  readonly isFormValid: boolean;
  readonly isSaving?: boolean;
  readonly hasPendingChanges?: boolean;
  readonly onNameChange: (value: string) => void;
  readonly onStartDateChange: (value: string) => void;
  readonly onEndDateChange: (value: string) => void;
  readonly onColorChange: (value: string) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;
  readonly onSave?: () => void;
};

export function PhaseCommonDataTab({
  isBasePhase,
  phaseName,
  phaseColor,
  formData,
  errors,
  isValidating,
  hasInteracted,
  isFormValid,
  isSaving = false,
  hasPendingChanges = false,
  onNameChange,
  onStartDateChange,
  onEndDateChange,
  onColorChange,
  onKeyDown,
  onSave,
}: PhaseCommonDataTabProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {onSave && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: 1.5,
            py: 0.75,
            mb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          }}
        >
          <Tooltip
            title={
              isSaving
                ? "Saving..."
                : hasPendingChanges
                  ? "Save changes"
                  : "No pending changes"
            }
            arrow
            placement="bottom"
          >
            <span>
              <IconButton
                onClick={onSave}
                disabled={isSaving || !isFormValid || !hasPendingChanges}
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: hasPendingChanges && isFormValid
                    ? theme.palette.primary.main
                    : alpha(theme.palette.action.disabled, 0.1),
                  color: hasPendingChanges && isFormValid
                    ? theme.palette.primary.contrastText
                    : theme.palette.action.disabled,
                  "&:hover": {
                    backgroundColor: hasPendingChanges && isFormValid
                      ? theme.palette.primary.dark
                      : alpha(theme.palette.action.disabled, 0.1),
                  },
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
      <Box sx={{ pt: 1, width: "100%" }}>
        <Stack spacing={3} sx={{ width: "100%" }}>
        <PhaseNameField
          isBasePhase={isBasePhase}
          phaseName={phaseName}
          formData={formData}
          errors={errors}
          isValidating={isValidating}
          hasInteracted={hasInteracted}
          onNameChange={onNameChange}
          onKeyDown={onKeyDown}
        />

        <PhaseDateFields
          formData={formData}
          errors={errors}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onKeyDown={onKeyDown}
        />

        <PhaseColorField
          isBasePhase={isBasePhase}
          phaseColor={phaseColor}
          formData={formData}
          errors={errors}
          onColorChange={onColorChange}
        />
      </Stack>
      </Box>
    </Box>
  );
}

