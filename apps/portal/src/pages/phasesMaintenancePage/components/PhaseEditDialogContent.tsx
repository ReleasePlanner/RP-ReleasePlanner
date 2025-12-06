import { memo } from "react";
import {
  Stack,
  TextField,
  Box,
  Grid,
  Tooltip,
  useTheme,
  alpha,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Tune as TuneIcon } from "@mui/icons-material";
import type { BasePhase } from "@/api/services/basePhases.service";

export type PhaseEditDialogContentProps = {
  readonly formData: Partial<BasePhase>;
  readonly onFormDataChange: (data: Partial<BasePhase>) => void;
};

const PREDEFINED_COLORS = [
  "#1976D2", // Blue
  "#388E3C", // Green
  "#FBC02D", // Yellow
  "#D32F2F", // Red
  "#7B1FA2", // Purple
  "#455A64", // Gray
];

/**
 * Component for the phase edit dialog content with color picker
 */
export const PhaseEditDialogContent = memo(function PhaseEditDialogContent({
  formData,
  onFormDataChange,
}: PhaseEditDialogContentProps) {
  const theme = useTheme();

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* Spacer to ensure controls are below header divider */}
      <Box sx={{ pt: 1 }} />

      {/* Phase Name Input */}
      <TextField
        autoFocus
        fullWidth
        size="small"
        label="Phase Name"
        placeholder="e.g., Planning, Development, Testing..."
        value={formData.name || ""}
        onChange={(e) =>
          onFormDataChange({ ...formData, name: e.target.value })
        }
        required
        slotProps={{
          inputLabel: {
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

      {/* Color Picker */}
      <Box sx={{ width: "100%" }}>
        {/* Colors Row */}
        <Grid container spacing={2} alignItems="center">
          {/* Predefined Colors */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="nowrap"
              sx={{
                gap: 1,
                "& > *": {
                  flexShrink: 0,
                },
              }}
            >
              {PREDEFINED_COLORS.map((color) => (
                <Tooltip key={color} title={color} arrow>
                  <Box
                    onClick={() => onFormDataChange({ ...formData, color })}
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: 1.5,
                      bgcolor: color,
                      cursor: "pointer",
                      border:
                        formData.color === color
                          ? `3px solid ${theme.palette.common.white}`
                          : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                      boxShadow:
                        formData.color === color
                          ? `0 0 0 2px ${color}, 0 2px 8px ${alpha(
                              theme.palette.common.black,
                              0.2
                            )}`
                          : "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: `0 2px 8px ${alpha(color, 0.4)}`,
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Grid>

          {/* Custom Color Box */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Tooltip title="Click to select a custom color" arrow>
              <Box
                component="label"
                htmlFor="custom-color-input"
                sx={{
                  position: "relative",
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  borderRadius: 1.5,
                  bgcolor: formData.color || "#1976D2",
                  cursor: "pointer",
                  border: !PREDEFINED_COLORS.includes(formData.color || "")
                    ? `3px solid ${theme.palette.common.white}`
                    : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                  boxShadow: !PREDEFINED_COLORS.includes(formData.color || "")
                    ? `0 0 0 2px ${
                        formData.color || "#1976D2"
                      }, 0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`
                    : "none",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: `0 2px 8px ${alpha(
                      formData.color || "#1976D2",
                      0.4
                    )}`,
                  },
                }}
              >
                <TuneIcon
                  sx={{
                    fontSize: { xs: 16, sm: 18 },
                    color: theme.palette.common.white,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                  }}
                />
                <input
                  id="custom-color-input"
                  type="color"
                  value={formData.color || "#1976D2"}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, color: e.target.value })
                  }
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      {/* Is Default Checkbox */}
      <Box sx={{ width: "100%" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isDefault || false}
              onChange={(e) =>
                onFormDataChange({ ...formData, isDefault: e.target.checked })
              }
              size="small"
            />
          }
          label={
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Use as default phase
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.625rem",
                  color: theme.palette.text.secondary,
                  display: "block",
                  mt: 0.25,
                }}
              >
                This phase will be automatically added to new release plans
              </Typography>
            </Box>
          }
          sx={{
            alignItems: "flex-start",
            m: 0,
            "& .MuiFormControlLabel-label": {
              ml: 1,
            },
          }}
        />
      </Box>
    </Stack>
  );
});
