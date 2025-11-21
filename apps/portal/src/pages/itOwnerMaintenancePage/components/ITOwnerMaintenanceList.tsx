import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { ITOwner } from "@/api/services/itOwners.service";
import { ITOwnerItem } from "./ITOwnerItem";

export type ITOwnerMaintenanceListProps = {
  readonly owners: ITOwner[];
  readonly isDeleting: boolean;
  readonly onEdit: (owner: ITOwner) => void;
  readonly onDelete: (ownerId: string) => void;
};

/**
 * Component for the list of IT owners
 */
export const ITOwnerMaintenanceList = memo(function ITOwnerMaintenanceList({
  owners,
  isDeleting,
  onEdit,
  onDelete,
}: ITOwnerMaintenanceListProps) {
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
      {owners.map((owner, index) => (
        <ITOwnerItem
          key={owner.id}
          owner={owner}
          isLast={index === owners.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

