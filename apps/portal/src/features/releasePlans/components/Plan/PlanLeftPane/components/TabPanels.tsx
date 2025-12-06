import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { TabPanel } from "./TabPanel";
import { CommonDataTab } from "./CommonDataTab";
import type {
  PlanStatus,
  PlanComponent,
  PlanReference,
  Plan,
} from "../../../../types";

// ⚡ OPTIMIZATION: Lazy load heavy tab components
// Only load when user navigates to that specific tab
// Note: These components use named exports, so we wrap them to work with lazy()
const PlanProductTab = lazy(() =>
  import(
    /* webpackChunkName: "plan-product-tab" */
    /* webpackPrefetch: true */
    "../../PlanProductTab"
  ).then((module) => ({ default: module.PlanProductTab }))
);

const PlanSetupTab = lazy(() =>
  import(
    /* webpackChunkName: "plan-setup-tab" */
    /* webpackPrefetch: true */
    "../../PlanSetupTab"
  ).then((module) => ({ default: module.PlanSetupTab }))
);

const PlanReferencesTab = lazy(() =>
  import(
    /* webpackChunkName: "plan-references-tab" */
    /* webpackPrefetch: true */
    "../../PlanReferencesTab/PlanReferencesTab"
  ).then((module) => ({ default: module.PlanReferencesTab }))
);

const PlanReschedulesTab = lazy(() =>
  import(
    /* webpackChunkName: "plan-reschedules-tab" */
    /* webpackPrefetch: true */
    "../../PlanReschedulesTab"
  ).then((module) => ({ default: module.PlanReschedulesTab }))
);

const PlanRcaTab = lazy(() =>
  import(
    /* webpackChunkName: "plan-rca-tab" */
    /* webpackPrefetch: true */
    "../../PlanRcaTab/PlanRcaTab"
  ).then((module) => ({ default: module.PlanRcaTab }))
);

export type TabPanelsProps = {
  readonly tabValue: number;
  readonly name: string;
  readonly description?: string;
  readonly status: PlanStatus;
  readonly startDate: string;
  readonly endDate: string;
  readonly id: string;
  readonly productId?: string;
  readonly originalProductId?: string;
  readonly itOwner?: string;
  readonly leadId?: string;
  readonly featureIds?: string[];
  readonly components?: PlanComponent[];
  readonly calendarIds?: string[];
  readonly indicatorIds?: string[];
  readonly teamIds?: string[];
  readonly references?: PlanReference[];
  readonly hasLocalChanges: boolean;
  readonly isSaving: boolean;
  readonly hasTabChanges: Record<number, boolean>;
  readonly planUpdatedAt?: string | Date;
  readonly plan?: Plan;
  readonly originalMetadata?: Plan["metadata"]; // Original metadata for comparing changes
  readonly localMetadata?: Plan["metadata"]; // Current metadata with pending changes in memory
  readonly onNameChange?: (name: string) => void;
  readonly onDescriptionChange?: (description: string) => void;
  readonly onStatusChange?: (status: PlanStatus) => void;
  readonly onStartDateChange?: (date: string) => void;
  readonly onEndDateChange?: (date: string) => void;
  readonly onProductChange: (productId: string) => void;
  readonly onITOwnerChange?: (itOwnerId: string) => void;
  readonly onLeadIdChange?: (leadId: string) => void;
  readonly onFeatureIdsChange?: (featureIds: string[]) => void;
  readonly onComponentsChange?: (components: PlanComponent[]) => void;
  readonly onCalendarIdsChange?: (calendarIds: string[]) => void;
  readonly onIndicatorIdsChange?: (indicatorIds: string[]) => void;
  readonly onTeamIdsChange?: (teamIds: string[]) => void;
  readonly onReferencesChange?: (references: PlanReference[]) => void;
  readonly onScrollToDate?: (date: string) => void;
  readonly onSaveTab?: (tabIndex: number) => Promise<void>;
};

export function TabPanels({
  tabValue,
  name,
  description,
  status,
  startDate,
  endDate,
  id,
  productId,
  originalProductId,
  itOwner,
  leadId,
  featureIds = [],
  components = [],
  calendarIds = [],
  indicatorIds = [],
  teamIds = [],
  references = [],
  hasLocalChanges,
  isSaving,
  hasTabChanges,
  planUpdatedAt,
  plan,
  originalMetadata,
  localMetadata,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onProductChange,
  onITOwnerChange,
  onLeadIdChange,
  onFeatureIdsChange,
  onComponentsChange,
  onCalendarIdsChange,
  onIndicatorIdsChange,
  onTeamIdsChange,
  onReferencesChange,
  onScrollToDate,
  onSaveTab,
}: TabPanelsProps) {
  return (
    <>
      {/* Tab 1: Common Data */}
      <TabPanel
        value={tabValue}
        index={0}
        onSave={onSaveTab ? () => onSaveTab(0) : undefined}
        isSaving={isSaving}
        hasPendingChanges={hasTabChanges[0] || false || hasLocalChanges}
      >
        <CommonDataTab
          name={name}
          description={description}
          status={status}
          startDate={startDate}
          endDate={endDate}
          teamIds={teamIds}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
          onStatusChange={onStatusChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
      </TabPanel>

      {/* Tab 2: Product (Features + Components) - Lazy loaded */}
      <TabPanel
        value={tabValue}
        index={1}
        onSave={onSaveTab ? () => onSaveTab(1) : undefined}
        isSaving={isSaving}
        hasPendingChanges={
          hasTabChanges[1] || false || hasTabChanges[2] || false
        }
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                p: 3,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          }
        >
          <PlanProductTab
            productId={productId}
            originalProductId={originalProductId}
            itOwner={itOwner}
            leadId={leadId}
            teamIds={teamIds}
            featureIds={featureIds}
            components={components}
            planId={id}
            planUpdatedAt={planUpdatedAt}
            plan={plan}
            onProductChange={onProductChange}
            onITOwnerChange={onITOwnerChange}
            onLeadIdChange={onLeadIdChange}
            onFeatureIdsChange={onFeatureIdsChange}
            onComponentsChange={onComponentsChange}
          />
        </Suspense>
      </TabPanel>

      {/* Tab 2: Setup (Calendars + Metrics + Teams) - Lazy loaded */}
      <TabPanel
        value={tabValue}
        index={2}
        onSave={onSaveTab ? () => onSaveTab(2) : undefined}
        isSaving={isSaving}
        hasPendingChanges={
          hasTabChanges[2] ||
          false || // Calendars (antes tab 2)
          hasTabChanges[4] ||
          false || // Metrics (antes tab 4)
          hasTabChanges[5] ||
          false // Teams (antes tab 5)
        }
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                p: 3,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          }
        >
          <PlanSetupTab
            calendarIds={calendarIds}
            indicatorIds={indicatorIds}
            teamIds={teamIds}
            onCalendarIdsChange={onCalendarIdsChange}
            onIndicatorIdsChange={onIndicatorIdsChange}
            onTeamIdsChange={onTeamIdsChange}
          />
        </Suspense>
      </TabPanel>

      {/* Tab 3: References - Lazy loaded */}
      <TabPanel
        value={tabValue}
        index={3}
        onSave={onSaveTab ? () => onSaveTab(3) : undefined}
        isSaving={isSaving}
        hasPendingChanges={hasTabChanges[3] || false}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                p: 3,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          }
        >
          <PlanReferencesTab
            references={references}
            onReferencesChange={onReferencesChange}
            onScrollToDate={onScrollToDate}
            phases={plan?.metadata?.phases || []}
            startDate={startDate}
            endDate={endDate}
            calendarIds={calendarIds}
          />
        </Suspense>
      </TabPanel>

      {/* Tab 4: Re-schedules - Lazy loaded */}
      <TabPanel
        value={tabValue}
        index={4}
        onSave={undefined}
        isSaving={false}
        hasPendingChanges={false}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                p: 3,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          }
        >
          <PlanReschedulesTab
            planId={id}
            originalPhases={originalMetadata?.phases || []}
            currentPhases={localMetadata?.phases || plan?.metadata?.phases || []}
          />
        </Suspense>
      </TabPanel>

      {/* Tab 5: RCA - Lazy loaded */}
      <TabPanel
        value={tabValue}
        index={5}
        onSave={undefined}
        isSaving={false}
        hasPendingChanges={false}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                p: 3,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          }
        >
          <PlanRcaTab planId={id} />
        </Suspense>
      </TabPanel>
    </>
  );
}
