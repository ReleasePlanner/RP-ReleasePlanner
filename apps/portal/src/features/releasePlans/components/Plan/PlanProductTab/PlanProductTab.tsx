import { useState } from "react";
import { Box, Stack, Divider, useTheme, alpha } from "@mui/material";
import { SelectFeaturesDialog } from "../PlanFeaturesTab/SelectFeaturesDialog";
import { SelectComponentsDialog } from "../PlanComponentsTab/SelectComponentsDialog";
import { ComponentVersionEditDialog } from "../PlanComponentsTab/ComponentVersionEditDialog/ComponentVersionEditDialog";
import { usePlanFeatures, useFeatureOperations } from "../PlanFeaturesTab/hooks";
import { usePlanComponents, usePlanComponentsStyles } from "../PlanComponentsTab/hooks";
import { FeaturesHeader, FeaturesContent, NoProductState } from "../PlanFeaturesTab/components";
import {
  ComponentsLoadingState,
  ComponentsEmptyState,
  ComponentsHeader,
  ComponentsTable,
} from "../PlanComponentsTab/components";
import type { Plan, PlanComponent } from "../../../types";
import type { ComponentWithDetails } from "../PlanComponentsTab/hooks";

export type PlanProductTabProps = {
  readonly productId?: string;
  readonly featureIds?: string[];
  readonly components?: PlanComponent[];
  readonly planId?: string;
  readonly planUpdatedAt?: string | Date;
  readonly plan?: Plan;
  readonly onFeatureIdsChange?: (featureIds: string[]) => void;
  readonly onComponentsChange?: (components: PlanComponent[]) => void;
};

export function PlanProductTab({
  productId,
  featureIds = [],
  components = [],
  planId,
  planUpdatedAt,
  plan,
  onFeatureIdsChange,
  onComponentsChange,
}: PlanProductTabProps) {
  const theme = useTheme();
  const [selectFeaturesDialogOpen, setSelectFeaturesDialogOpen] = useState(false);
  const [selectComponentsDialogOpen, setSelectComponentsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<PlanComponent | null>(null);

  // Features hooks
  const { allProductFeatures, planFeatures: rawPlanFeatures, isLoadingFeatures } =
    usePlanFeatures(productId, featureIds);
  const planFeatures = rawPlanFeatures || [];
  const { isRemoving, isAdding, handleDeleteFeature, handleAddFeatures } =
    useFeatureOperations(
      planId,
      plan,
      planUpdatedAt,
      featureIds,
      allProductFeatures,
      onFeatureIdsChange
    );

  // Components hooks
  const { product, planComponentsWithDetails, isLoading } = usePlanComponents(
    productId,
    components
  );
  const styles = usePlanComponentsStyles();

  const handleAddFeaturesWithDialog = async (newFeatureIds: string[]) => {
    await handleAddFeatures(newFeatureIds);
    setSelectFeaturesDialogOpen(false);
  };

  const handleAddComponents = (newComponents: PlanComponent[]) => {
    if (onComponentsChange) {
      const existingIds = new Set(components.map((c) => c.componentId));
      const uniqueNewComponents = newComponents.filter(
        (c) => !existingIds.has(c.componentId)
      );
      if (uniqueNewComponents.length > 0) {
        onComponentsChange([...components, ...uniqueNewComponents]);
      }
    }
    setSelectComponentsDialogOpen(false);
  };

  const handleEditComponent = (component: PlanComponent) => {
    setEditingComponent(component);
    setEditDialogOpen(true);
  };

  const handleSaveComponent = (updatedComponent: PlanComponent) => {
    if (onComponentsChange) {
      onComponentsChange(
        components.map((c) =>
          c.componentId === updatedComponent.componentId ? updatedComponent : c
        )
      );
    }
    setEditDialogOpen(false);
    setEditingComponent(null);
  };

  const handleDeleteComponent = (componentId: string) => {
    if (onComponentsChange) {
      onComponentsChange(components.filter((c) => c.componentId !== componentId));
    }
  };

  if (!productId) {
    return <NoProductState />;
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* Features Section */}
        <Box
          sx={{
            flex: "0 0 auto",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
            <FeaturesHeader
              featureCount={planFeatures.length}
              isAdding={isAdding}
              productId={productId}
              onAddClick={() => setSelectFeaturesDialogOpen(true)}
            />
          </Box>
          <Divider />
          <Box sx={{ p: { xs: 1.5, sm: 2 }, maxHeight: 300, overflow: "auto" }}>
            <FeaturesContent
              isLoadingFeatures={isLoadingFeatures}
              allProductFeatures={allProductFeatures}
              planFeatures={planFeatures}
              isRemoving={isRemoving}
              onDeleteFeature={handleDeleteFeature}
            />
          </Box>
        </Box>

        {/* Components Section */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
            <ComponentsHeader
              componentCount={planComponentsWithDetails.length}
              onAddClick={() => setSelectComponentsDialogOpen(true)}
              styles={styles}
              productId={productId}
            />
          </Box>
          <Divider />
          <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: { xs: 1.5, sm: 2 } }}>
            {isLoading ? (
              <ComponentsLoadingState />
            ) : planComponentsWithDetails.length === 0 ? (
              <ComponentsEmptyState />
            ) : (
              <ComponentsTable
                components={planComponentsWithDetails}
                onEdit={handleEditComponent}
                onDelete={handleDeleteComponent}
                styles={styles}
              />
            )}
          </Box>
        </Box>
      </Stack>

      {/* Dialogs */}
      <SelectFeaturesDialog
        open={selectFeaturesDialogOpen}
        productId={productId}
        selectedFeatureIds={featureIds}
        planId={planId}
        onClose={() => setSelectFeaturesDialogOpen(false)}
        onAddFeatures={handleAddFeaturesWithDialog}
      />

      <SelectComponentsDialog
        open={selectComponentsDialogOpen}
        productId={productId}
        selectedComponentIds={components.map((c) => c.componentId)}
        onClose={() => setSelectComponentsDialogOpen(false)}
        onAddComponents={handleAddComponents}
      />

      {editingComponent && (
        <ComponentVersionEditDialog
          open={editDialogOpen}
          component={editingComponent}
          product={product}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingComponent(null);
          }}
          onSave={handleSaveComponent}
        />
      )}
    </Box>
  );
}

