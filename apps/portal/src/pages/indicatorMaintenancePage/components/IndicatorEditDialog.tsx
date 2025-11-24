/**
 * Indicator Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing indicators
 * Inherits from BaseEditDialog
 */

import {
  TextField,
  Stack,
  Box,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
import type { Indicator, IndicatorStatus } from "@/api/services/indicators.service";

interface IndicatorEditDialogProps {
  open: boolean;
  indicator: Indicator | null;
  onClose: () => void;
  onSave: () => void;
  onIndicatorChange: (indicator: Indicator) => void;
}

export function IndicatorEditDialog({
  open,
  indicator,
  onClose,
  onSave,
  onIndicatorChange,
}: IndicatorEditDialogProps) {
  const theme = useTheme();
  const isEditing = indicator?.id && !indicator.id.startsWith('indicator-');

  if (!indicator) return null;

  const isValid = !!indicator.name?.trim();

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Indicator" : "New Indicator"}
      subtitle="Manage indicator information"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Indicator"}
      isFormValid={isValid}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Spacer to ensure controls are below header divider */}
        <Box sx={{ pt: 1 }} />
        
        {/* Indicator Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Indicator Name"
          placeholder="e.g., Customer Satisfaction Score, Revenue Growth"
          value={indicator.name || ""}
          onChange={(e) =>
            onIndicatorChange({ ...indicator, name: e.target.value })
          }
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />

        {/* Description */}
        <TextField
          fullWidth
          size="small"
          label="Description"
          placeholder="e.g., Measures overall customer satisfaction with the product"
          value={indicator.description || ""}
          onChange={(e) =>
            onIndicatorChange({ ...indicator, description: e.target.value })
          }
          multiline
          rows={3}
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& textarea": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />

        {/* Formula */}
        <TextField
          fullWidth
          size="small"
          label="Formula (Optional)"
          placeholder="e.g., (positive_responses / total_responses) * 100"
          value={indicator.formula || ""}
          onChange={(e) =>
            onIndicatorChange({ ...indicator, formula: e.target.value })
          }
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              fontFamily: "monospace",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />

        {/* Status */}
        <FormControl fullWidth size="small">
          <InputLabel
            shrink
            sx={{
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            }}
          >
            Status
          </InputLabel>
          <Select
            value={indicator.status || "active"}
            onChange={(e) =>
              onIndicatorChange({ ...indicator, status: e.target.value as IndicatorStatus })
            }
            sx={{
              fontSize: "0.6875rem",
              "& .MuiSelect-select": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
            }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </BaseEditDialog>
  );
}

