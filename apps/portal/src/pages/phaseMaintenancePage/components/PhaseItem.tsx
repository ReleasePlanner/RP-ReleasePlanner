import { memo } from "react";
import { Box, Button } from "@mui/material";
import type { BasePhase } from "@/features/releasePlans/basePhasesSlice";

export type PhaseItemProps = {
  readonly phase: BasePhase;
  readonly onEdit?: (phase: BasePhase) => void;
};

/**
 * Component for a single phase item in the list
 */
export const PhaseItem = memo(function PhaseItem({
  phase,
  onEdit,
}: PhaseItemProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 0,
        border: `1px solid #eee`,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          bgcolor: phase.color,
          border: `1px solid #eee`,
        }}
      />
      <Box sx={{ flex: 1 }}>
        <strong>{phase.name}</strong>
      </Box>
      {onEdit && (
        <Button
          size="small"
          variant="text"
          sx={{ textTransform: "none" }}
          onClick={() => onEdit(phase)}
        >
          Edit
        </Button>
      )}
    </Box>
  );
});

