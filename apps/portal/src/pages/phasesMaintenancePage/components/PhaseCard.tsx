import { memo } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
} from "@mui/icons-material";
import type { BasePhase } from "@/features/releasePlans/types";

export type PhaseCardProps = {
  readonly phase: BasePhase;
  readonly onEdit: (phase: BasePhase) => void;
  readonly onDelete: (phase: BasePhase) => void;
  readonly onDuplicate: (phase: BasePhase) => void;
};

/**
 * Component for a single phase card in the grid
 */
export const PhaseCard = memo(function PhaseCard({
  phase,
  onEdit,
  onDelete,
  onDuplicate,
}: PhaseCardProps) {
  const theme = useTheme();

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: phase.color,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            />
            <Typography variant="h6" component="div">
              {phase.name}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(phase)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicate">
            <IconButton size="small" onClick={() => onDuplicate(phase)}>
              <DuplicateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(phase)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );
});

