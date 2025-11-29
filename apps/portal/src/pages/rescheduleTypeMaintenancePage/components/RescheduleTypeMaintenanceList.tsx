import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { RescheduleType } from "@/api/services/rescheduleTypes.service";
import { RescheduleTypeItem } from "./RescheduleTypeItem";

export type RescheduleTypeMaintenanceListProps = {
  readonly rescheduleTypes: RescheduleType[];
  readonly isDeleting: boolean;
  readonly onEdit: (rescheduleType: RescheduleType) => void;
  readonly onDelete: (rescheduleTypeId: string) => void;
};

/**
 * Component for the list of Reschedule Types
 */
export const RescheduleTypeMaintenanceList = memo(function RescheduleTypeMaintenanceList({
  rescheduleTypes,
  isDeleting,
  onEdit,
  onDelete,
}: RescheduleTypeMaintenanceListProps) {
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
      {rescheduleTypes.map((rescheduleType, index) => (
        <RescheduleTypeItem
          key={rescheduleType.id}
          rescheduleType={rescheduleType}
          isLast={index === rescheduleTypes.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

