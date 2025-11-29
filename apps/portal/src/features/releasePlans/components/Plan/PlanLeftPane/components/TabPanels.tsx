import { TabPanel } from "./TabPanel";
import { CommonDataTab } from "./CommonDataTab";
import { PlanProductTab } from "../../PlanProductTab";
import { PlanSetupTab } from "../../PlanSetupTab";
import { PlanReferencesTab } from "../../PlanReferencesTab/PlanReferencesTab";
import { PlanReschedulesTab } from "../../PlanReschedulesTab";
import type {
  PlanStatus,
  PlanComponent,
  PlanReference,
  Plan,
} from "../../../../types";

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
        hasPendingChanges={(hasTabChanges[0] || false) || hasLocalChanges}
      >
        <CommonDataTab
          name={name}
          description={description}
          status={status}
          startDate={startDate}
          endDate={endDate}
          productId={productId}
          originalProductId={originalProductId}
          itOwner={itOwner}
          leadId={leadId}
          teamIds={teamIds}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
          onStatusChange={onStatusChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onProductChange={onProductChange}
          onITOwnerChange={onITOwnerChange}
          onLeadIdChange={onLeadIdChange}
        />
      </TabPanel>

      {/* Tab 2: Product (Features + Components) */}
      <TabPanel
        value={tabValue}
        index={1}
        onSave={onSaveTab ? () => onSaveTab(1) : undefined}
        isSaving={isSaving}
        hasPendingChanges={(hasTabChanges[1] || false) || (hasTabChanges[2] || false)}
      >
        <PlanProductTab
          productId={productId}
          featureIds={featureIds}
          components={components}
          planId={id}
          planUpdatedAt={planUpdatedAt}
          plan={plan}
          onFeatureIdsChange={onFeatureIdsChange}
          onComponentsChange={onComponentsChange}
        />
      </TabPanel>

      {/* Tab 2: Setup (Calendars + Metrics + Teams) */}
      <TabPanel
        value={tabValue}
        index={2}
        onSave={onSaveTab ? () => onSaveTab(2) : undefined}
        isSaving={isSaving}
        hasPendingChanges={
          (hasTabChanges[2] || false) || // Calendars (antes tab 2)
          (hasTabChanges[4] || false) || // Metrics (antes tab 4)
          (hasTabChanges[5] || false)    // Teams (antes tab 5)
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
      </TabPanel>

      {/* Tab 3: References */}
      <TabPanel
        value={tabValue}
        index={3}
        onSave={onSaveTab ? () => onSaveTab(3) : undefined}
        isSaving={isSaving}
        hasPendingChanges={hasTabChanges[3] || false}
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
      </TabPanel>

      {/* Tab 4: Re-schedules */}
      <TabPanel
        value={tabValue}
        index={4}
        onSave={undefined}
        isSaving={false}
        hasPendingChanges={false}
      >
        <PlanReschedulesTab planId={id} />
      </TabPanel>
    </>
  );
}

