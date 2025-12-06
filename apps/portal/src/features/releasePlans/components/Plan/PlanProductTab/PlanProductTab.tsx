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
import { ProductField } from "../PlanLeftPane/components/CommonDataTab/fields/ProductField";
import { ITOwnerField } from "../PlanLeftPane/components/CommonDataTab/fields/ITOwnerField";
import { LeadField } from "../PlanLeftPane/components/CommonDataTab/fields/LeadField";
import { useLocalState, useFieldValidation } from "../PlanLeftPane/hooks";
import { useITOwners, useProducts } from "@/api/hooks";
import { usePlanTalents } from "../PlanLeftPane/components/CommonDataTab/hooks/usePlanTalents";
import type { Plan, PlanComponent } from "../../../types";
import type { ComponentWithDetails } from "../PlanComponentsTab/hooks";

export type PlanProductTabProps = {
  readonly productId?: string;
  readonly originalProductId?: string;
  readonly itOwner?: string;
  readonly leadId?: string;
  readonly teamIds?: string[];
  readonly featureIds?: string[];
  readonly components?: PlanComponent[];
  readonly planId?: string;
  readonly planUpdatedAt?: string | Date;
  readonly plan?: Plan;
  readonly onProductChange?: (productId: string) => void;
  readonly onITOwnerChange?: (itOwnerId: string) => void;
  readonly onLeadIdChange?: (leadId: string) => void;
  readonly onFeatureIdsChange?: (featureIds: string[]) => void;
  readonly onComponentsChange?: (components: PlanComponent[]) => void;
};

export function PlanProductTab({
  productId,
  originalProductId,
  itOwner,
  leadId,
  teamIds = [],
  featureIds = [],
  components = [],
  planId,
  planUpdatedAt,
  plan,
  onProductChange,
  onITOwnerChange,
  onLeadIdChange,
  onFeatureIdsChange,
  onComponentsChange,
}: PlanProductTabProps) {
  const theme = useTheme();
  const [selectFeaturesDialogOpen, setSelectFeaturesDialogOpen] = useState(false);
  const [selectComponentsDialogOpen, setSelectComponentsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<PlanComponent | null>(null);

  // Local state for Product, IT Owner, and Lead fields
  const {
    localProductId,
    setLocalProductId,
    localItOwner,
    setLocalItOwner,
    localLeadId,
    setLocalLeadId,
  } = useLocalState(
    "", // name - not used here
    "", // description - not used here
    "planned", // status - not used here
    "", // startDate - not used here
    "", // endDate - not used here
    productId,
    itOwner,
    leadId
  );

  // Data hooks
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: itOwners = [], isLoading: isLoadingITOwners } = useITOwners();
  const { talents, isLoading: isLoadingTalents } = usePlanTalents(teamIds);

  // Validation hook
  const { validProductId, validItOwner, validLeadId } = useFieldValidation(
    localProductId,
    localItOwner,
    localLeadId,
    products,
    itOwners,
    talents,
    isLoadingProducts,
    isLoadingITOwners,
    isLoadingTalents,
    onProductChange || (() => {}),
    onITOwnerChange || (() => {}),
    onLeadIdChange || (() => {})
  );

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

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "fit-content",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* Product, Product Owner, and Lead Fields Section */}
        <Box
          sx={{
            flex: "0 0 auto",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            p: { xs: 1.5, sm: 2 },
            bgcolor: alpha(theme.palette.background.paper, 0.5),
          }}
        >
          <Stack spacing={1.5}>
            <ProductField
              originalProductId={originalProductId}
              products={products}
              validProductId={validProductId}
              localProductId={localProductId}
              onProductChange={(newValue) => {
                setLocalProductId(newValue || undefined);
                if (onProductChange && newValue !== productId) {
                  onProductChange(newValue);
                }
              }}
            />

            <ITOwnerField
              itOwners={itOwners}
              validItOwner={validItOwner}
              localItOwner={localItOwner}
              isLoadingITOwners={isLoadingITOwners}
              onITOwnerChange={(newValue) => {
                setLocalItOwner(newValue || undefined);
                if (onITOwnerChange && newValue !== itOwner) {
                  onITOwnerChange(newValue);
                }
              }}
            />

            <LeadField
              talents={talents}
              validLeadId={validLeadId}
              localLeadId={localLeadId}
              isLoadingTalents={isLoadingTalents}
              onLeadIdChange={(newValue) => {
                setLocalLeadId(newValue || undefined);
                if (onLeadIdChange && newValue !== leadId) {
                  onLeadIdChange(newValue);
                }
              }}
            />
          </Stack>
        </Box>

        {/* Features Section - Only show if product is selected */}
        {!productId ? (
          <NoProductState />
        ) : (
          <>
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
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {isLoading ? (
              <ComponentsLoadingState />
            ) : planComponentsWithDetails.length === 0 ? (
              <ComponentsEmptyState />
            ) : (
              <ComponentsTable
                components={planComponentsWithDetails}
                onEdit={handleEditComponent}
                onDelete={handleDeleteComponent}
              />
            )}
          </Box>
        </Box>
          </>
        )}
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

