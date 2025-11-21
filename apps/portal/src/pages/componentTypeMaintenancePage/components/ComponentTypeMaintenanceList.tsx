import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { ComponentType } from "@/api/services/componentTypes.service";
import { ComponentTypeItem } from "./ComponentTypeItem";

export type ComponentTypeMaintenanceListProps = {
  readonly types: ComponentType[];
  readonly isDeleting: boolean;
  readonly onEdit: (type: ComponentType) => void;
  readonly onDelete: (typeId: string) => void;
};

/**
 * Component for the list of component types
 */
export const ComponentTypeMaintenanceList = memo(function ComponentTypeMaintenanceList({
  types,
  isDeleting,
  onEdit,
  onDelete,
}: ComponentTypeMaintenanceListProps) {
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
      {types.map((type, index) => (
        <ComponentTypeItem
          key={type.id}
          type={type}
          isLast={index === types.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

