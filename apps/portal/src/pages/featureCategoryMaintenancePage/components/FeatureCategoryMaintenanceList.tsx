import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { FeatureCategory } from "@/api/services/featureCategories.service";
import { FeatureCategoryItem } from "./FeatureCategoryItem";

export type FeatureCategoryMaintenanceListProps = {
  readonly categories: FeatureCategory[];
  readonly isDeleting: boolean;
  readonly onEdit: (category: FeatureCategory) => void;
  readonly onDelete: (categoryId: string) => void;
};

/**
 * Component for the list of feature categories
 */
export const FeatureCategoryMaintenanceList = memo(
  function FeatureCategoryMaintenanceList({
    categories,
    isDeleting,
    onEdit,
    onDelete,
  }: FeatureCategoryMaintenanceListProps) {
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
        {categories.map((category, index) => (
          <FeatureCategoryItem
            key={category.id}
            category={category}
            isLast={index === categories.length - 1}
            isDeleting={isDeleting}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Paper>
    );
  }
);

