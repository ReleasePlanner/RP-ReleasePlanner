import { Box, Select, MenuItem, Typography, useTheme, alpha } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

export type LeadFieldProps = {
  readonly talents: Array<{ id: string; name: string; email?: string; role?: { name: string } }>;
  readonly validLeadId: string;
  readonly localLeadId: string | undefined;
  readonly isLoadingTalents: boolean;
  readonly onLeadIdChange: (value: string) => void;
};

export function LeadField({
  talents,
  validLeadId,
  localLeadId,
  isLoadingTalents,
  onLeadIdChange,
}: LeadFieldProps) {
  const theme = useTheme();

  const handleMenuClose = () => {
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement?.blur) {
        activeElement.blur();
      }
    }, 0);
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.625rem",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mb: 0.5,
          display: "block",
        }}
      >
        Lead
      </Typography>
      <Select
        id="plan-lead-select"
        name="planLead"
        value={validLeadId}
        onChange={(e: SelectChangeEvent) => onLeadIdChange(e.target.value)}
        displayEmpty
        disabled={talents.length === 0 && !isLoadingTalents}
        slotProps={{
          menu: {
            disableAutoFocusItem: true,
            onClose: handleMenuClose,
          },
        }}
        renderValue={(selected) => {
          if (!selected || selected === "") {
            return (
              <em
                style={{
                  color: theme.palette.text.secondary,
                  fontStyle: "normal",
                  fontSize: "0.6875rem",
                }}
              >
                {talents.length === 0 && !isLoadingTalents ? "No teams assigned" : "None"}
              </em>
            );
          }
          const talent = talents.find((t) => t.id === selected);
          return (
            <span style={{ fontSize: "0.6875rem" }}>
              {talent ? talent.name : selected}
            </span>
          );
        }}
        size="small"
        sx={{
          width: "100%",
          fontSize: "0.6875rem",
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.5)
              : "background.paper",
          "& .MuiSelect-select": {
            py: 0.625,
            fontSize: "0.6875rem",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.divider, 0.2),
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1.5,
          },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
          <em>None</em>
        </MenuItem>
        {isLoadingTalents ? (
          <MenuItem
            disabled
            sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
          >
            Loading talents...
          </MenuItem>
        ) : talents.length === 0 ? (
          <MenuItem
            disabled
            sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
          >
            No talents available. Assign teams first.
          </MenuItem>
        ) : (
          talents.map((talent) => (
            <MenuItem
              key={talent.id}
              value={talent.id}
              sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                <span>{talent.name}</span>
                {(talent.email || talent.role) && (
                  <span
                    style={{
                      fontSize: "0.5625rem",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {[talent.email, talent.role?.name].filter(Boolean).join(" • ")}
                  </span>
                )}
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    </Box>
  );
}

