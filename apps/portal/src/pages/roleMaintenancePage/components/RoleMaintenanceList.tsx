import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { Role } from "@/api/services/roles.service";
import { RoleItem } from "./RoleItem";

export type RoleMaintenanceListProps = {
  readonly roles: Role[];
  readonly isDeleting: boolean;
  readonly onEdit: (role: Role) => void;
  readonly onDelete: (roleId: string) => void;
};

/**
 * Component for the list of roles
 */
export const RoleMaintenanceList = memo(function RoleMaintenanceList({
  roles,
  isDeleting,
  onEdit,
  onDelete,
}: RoleMaintenanceListProps) {
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
      {roles.map((role, index) => (
        <RoleItem
          key={role.id}
          role={role}
          isLast={index === roles.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

