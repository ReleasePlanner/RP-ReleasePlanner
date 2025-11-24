import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { Indicator } from "@/api/services/indicators.service";
import { IndicatorItem } from "./IndicatorItem";

export type IndicatorMaintenanceListProps = {
  readonly indicators: Indicator[];
  readonly isDeleting: boolean;
  readonly onEdit: (indicator: Indicator) => void;
  readonly onDelete: (indicatorId: string) => void;
};

/**
 * Component for the list of indicators
 */
export const IndicatorMaintenanceList = memo(function IndicatorMaintenanceList({
  indicators,
  isDeleting,
  onEdit,
  onDelete,
}: IndicatorMaintenanceListProps) {
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
      {indicators.map((indicator, index) => (
        <IndicatorItem
          key={indicator.id}
          indicator={indicator}
          isLast={index === indicators.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

