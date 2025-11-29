import { memo } from "react";
import { Box, Paper, useTheme, alpha } from "@mui/material";
import type { Team } from "@/api/services/teams.service";
import { TeamItem } from "./TeamItem";
import type { PlanTeamsStyles } from "../hooks/usePlanTeamsStyles";

export type TeamsListProps = {
  readonly teams: Team[];
  readonly onDelete: (id: string) => void;
  readonly styles: PlanTeamsStyles;
};

export const TeamsList = memo(function TeamsList({
  teams,
  onDelete,
  styles,
}: TeamsListProps) {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
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
            onDelete={onDelete}
            styles={styles}
          />
        ))}
      </Paper>
    </Box>
  );
});

