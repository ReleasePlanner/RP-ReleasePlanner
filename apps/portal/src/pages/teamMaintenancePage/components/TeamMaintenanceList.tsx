import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { Team } from "@/api/services/teams.service";
import { TeamItem } from "./TeamItem";

export type TeamMaintenanceListProps = {
  readonly teams: Team[];
  readonly isDeleting: boolean;
  readonly onEdit: (team: Team) => void;
  readonly onDelete: (teamId: string) => void;
};

/**
 * Component for the list of teams
 */
export const TeamMaintenanceList = memo(function TeamMaintenanceList({
  teams,
  isDeleting,
  onEdit,
  onDelete,
}: TeamMaintenanceListProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {teams.map((team, index) => (
        <TeamItem
          key={team.id}
          team={team}
          isLast={index === teams.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

