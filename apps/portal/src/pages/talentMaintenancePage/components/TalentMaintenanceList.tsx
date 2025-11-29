import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import { TalentItem } from "./TalentItem";
import type { Talent } from "@/api/services/talents.service";

export type TalentMaintenanceListProps = {
  readonly talents: readonly Talent[];
  readonly isDeleting: boolean;
  readonly onEdit: (talent: Talent) => void;
  readonly onDelete: (talentId: string) => void;
};

/**
 * Component for the list of talents
 */
export const TalentMaintenanceList = memo(function TalentMaintenanceList({
  talents,
  isDeleting,
  onEdit,
  onDelete,
}: TalentMaintenanceListProps) {
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
      {talents.map((talent, index) => (
        <TalentItem
          key={talent.id}
          talent={talent}
          isLast={index === talents.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

