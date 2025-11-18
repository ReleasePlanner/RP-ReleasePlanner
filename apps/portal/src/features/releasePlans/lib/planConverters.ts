/**
 * Plan Type Converters
 *
 * Converts between local Plan format (with metadata) and API Plan format (flat structure)
 */

import type {
  Plan as LocalPlan,
  PlanReferenceType,
} from "../types";
import type {
  Plan as APIPlan,
  UpdatePlanDto,
} from "../../../api/services/plans.service";

/**
 * Convert API Plan to Local Plan format
 */
export function convertAPIPlanToLocal(apiPlan: APIPlan): LocalPlan {
  return {
    id: apiPlan.id,
    metadata: {
      id: apiPlan.id,
      name: apiPlan.name,
      owner: apiPlan.owner,
      startDate: apiPlan.startDate,
      endDate: apiPlan.endDate,
      status: apiPlan.status,
      description: apiPlan.description,
      phases: apiPlan.phases?.map((p) => ({
        id: p.id,
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        color: p.color,
      })),
      productId: apiPlan.productId,
      itOwner: apiPlan.itOwner,
      featureIds: apiPlan.featureIds || [],
      components: (apiPlan.components || []).map((c) => ({
        componentId: c.componentId,
        currentVersion: c.currentVersion || "", // API provides currentVersion
        finalVersion: c.finalVersion,
      })),
      calendarIds: apiPlan.calendarIds || [],
      milestones: apiPlan.milestones?.map((m) => ({
        phaseId: m.phaseId,
        id: m.id,
        date: m.date,
        name: m.name,
        description: m.description,
      })),
      references: (() => {
        const apiReferences = apiPlan.references || [];

        // Debug: Log references from API - always log to see what's happening
        console.log("[planConverters] Converting references from API:", {
          planId: apiPlan.id,
          planName: apiPlan.name,
          apiReferences: apiReferences,
          apiReferencesLength: apiReferences.length,
          apiReferencesType: typeof apiReferences,
          isArray: Array.isArray(apiReferences),
          references:
            apiReferences.length > 0
              ? apiReferences.map((r) => ({
                  id: r.id,
                  type: r.type,
                  title: r.title,
                  createdAt: r.createdAt,
                  updatedAt: r.updatedAt,
                }))
              : [],
        });

        const filteredReferences = apiReferences.filter(
          (r) =>
            r.type === "link" ||
            r.type === "document" ||
            r.type === "note" ||
            r.type === "milestone"
        );

        console.log("[planConverters] After filtering references:", {
          originalCount: apiReferences.length,
          filteredCount: filteredReferences.length,
          filteredReferences: filteredReferences.map((r) => ({
            id: r.id,
            type: r.type,
            title: r.title,
          })),
        });

        const mappedReferences = filteredReferences.map((r) => {
          // Helper function to safely convert dates to ISO strings
          const toISOString = (
            date: string | Date | null | undefined
          ): string => {
            if (!date) {
              // If date is null/undefined, return current date as fallback
              return new Date().toISOString();
            }
            if (typeof date === "string") {
              // If it's already a string, validate it can be parsed
              const parsed = new Date(date);
              if (Number.isNaN(parsed.getTime())) {
                // Invalid date string, return current date as fallback
                return new Date().toISOString();
              }
              return date; // Valid date string, return as-is
            }
            // If it's a Date object, convert to ISO string
            const dateObj = new Date(date);
            if (Number.isNaN(dateObj.getTime())) {
              // Invalid date, return current date as fallback
              return new Date().toISOString();
            }
            return dateObj.toISOString();
          };

          return {
            id: r.id,
            type: r.type as PlanReferenceType,
            title: r.title,
            url: r.url,
            description: r.description,
            // Convert Date objects to ISO strings if needed, with validation
            createdAt: toISOString(r.createdAt),
            updatedAt: toISOString(r.updatedAt),
            // New reference level fields
            planReferenceTypeId: r.planReferenceTypeId,
            planReferenceType: r.planReferenceType,
            periodDay: r.periodDay,
            calendarDayId: r.calendarDayId,
            calendarDay: r.calendarDay,
            phaseId: r.phaseId,
            // Legacy fields
            date: r.date, // Legacy field - deprecated
            milestoneColor: r.milestoneColor, // Include milestoneColor from API
            files: r.files, // Include files for document type
          };
        });

        console.log("[planConverters] Final mapped references:", {
          count: mappedReferences.length,
          references: mappedReferences.map((r) => ({
            id: r.id,
            type: r.type,
            title: r.title,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          })),
        });

        return mappedReferences;
      })(),
      // Note: cellData has been removed - references are now handled via plan_references table
    },
    tasks:
      apiPlan.tasks?.map((t) => ({
        id: t.id,
        title: t.title,
        startDate: t.startDate,
        endDate: t.endDate,
        color: t.color,
      })) || [],
  };
}

/**
 * Convert Local Plan to API UpdatePlanDto format
 */
export function convertLocalPlanToUpdateDto(
  localPlan: LocalPlan
): UpdatePlanDto {
  return {
    name: localPlan.metadata.name,
    // Removed: owner field - use itOwner field instead and join with owners table
    startDate: localPlan.metadata.startDate,
    endDate: localPlan.metadata.endDate,
    status: localPlan.metadata.status,
    description: localPlan.metadata.description,
    phases: localPlan.metadata.phases?.map((p) => ({
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
      color: p.color,
    })),
    productId: localPlan.metadata.productId,
    itOwner: localPlan.metadata.itOwner,
    featureIds: localPlan.metadata.featureIds,
    calendarIds: localPlan.metadata.calendarIds,
    // Note: milestones, references, and tasks are managed separately
    // They should be included in the update if needed
  };
}

// Helper functions to reduce cognitive complexity
function mapPhasesToDto(phases: LocalPlan["metadata"]["phases"]) {
  return phases?.map((p) => ({
    name: p.name,
    startDate: p.startDate,
    endDate: p.endDate,
    color: p.color,
  }));
}

function mapMilestonesToDto(milestones: LocalPlan["metadata"]["milestones"]) {
  return milestones?.map((m) => ({
    name: m.name,
    date: m.date,
    description: m.description,
    phaseId: m.phaseId,
  }));
}

// Note: mapCellDataToDto has been removed - cellData is no longer used

function mapReferencesToDto(references: LocalPlan["metadata"]["references"]) {
  return references?.map((r) => ({
    type: r.type,
    title: r.title,
    url: r.url,
    description: r.description,
    // New reference level fields
    planReferenceTypeId: r.planReferenceTypeId,
    periodDay: r.periodDay,
    calendarDayId: r.calendarDayId,
    phaseId: r.phaseId,
    // Legacy fields
    date: r.date, // Legacy field - deprecated
    // Include milestoneColor for milestone type references
    ...(r.type === "milestone" &&
      r.milestoneColor && { milestoneColor: r.milestoneColor }),
    // Include files for document type references
    ...(r.type === "document" &&
      r.files && { files: r.files.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        url: f.url,
      })) }),
  }));
}

function formatUpdatedAt(updatedAt?: Date | string): string | undefined {
  if (!updatedAt) return undefined;
  return typeof updatedAt === "string" ? updatedAt : updatedAt.toISOString();
}

/**
 * Create a partial UpdatePlanDto from local plan changes
 * @param localPlan - The local plan object
 * @param changes - Partial changes to apply
 * @param originalUpdatedAt - Optional original updatedAt for optimistic locking
 */
export function createPartialUpdateDto(
  localPlan: LocalPlan,
  changes: Partial<LocalPlan["metadata"]>,
  originalUpdatedAt?: Date | string
): UpdatePlanDto {
  const dto: UpdatePlanDto & { updatedAt?: string } = {};

  // Simple field mappings - using a more functional approach
  const simpleFields: Array<keyof LocalPlan["metadata"]> = [
    "name",
    // Removed: "owner" - use itOwner field instead and join with owners table
    "startDate",
    "endDate",
    "status",
    "description",
    "productId",
    "itOwner",
    "featureIds",
    "calendarIds",
    "components",
  ];

  for (const field of simpleFields) {
    if (changes[field] !== undefined) {
      dto[field as keyof UpdatePlanDto] = changes[field] as never;
    }
  }

  // Complex field mappings using helper functions
  if (changes.phases !== undefined) {
    dto.phases = mapPhasesToDto(changes.phases);
  }
  if (changes.milestones !== undefined) {
    dto.milestones = mapMilestonesToDto(changes.milestones);
  }
  // Note: cellData has been removed - references are now handled via plan_references table
  if (changes.references !== undefined) {
    dto.references = mapReferencesToDto(changes.references);
  }

  // Include updatedAt for optimistic locking
  const formattedUpdatedAt = formatUpdatedAt(originalUpdatedAt);
  if (formattedUpdatedAt) {
    (dto as UpdatePlanDto & { updatedAt: string }).updatedAt =
      formattedUpdatedAt;
  }

  return dto;
}

/**
 * Create UpdatePlanDto with full plan data (for complete updates)
 */
export function createFullUpdateDto(
  localPlan: LocalPlan,
  originalUpdatedAt?: Date | string
): UpdatePlanDto {
  return {
    name: localPlan.metadata.name,
    // Removed: owner field - use itOwner field instead and join with owners table
    startDate: localPlan.metadata.startDate,
    endDate: localPlan.metadata.endDate,
    status: localPlan.metadata.status,
    description: localPlan.metadata.description,
    productId: localPlan.metadata.productId,
    itOwner: localPlan.metadata.itOwner,
    featureIds: localPlan.metadata.featureIds,
    calendarIds: localPlan.metadata.calendarIds,
    components: localPlan.metadata.components?.map((c) => ({
      componentId: c.componentId,
      currentVersion: c.currentVersion,
      finalVersion: c.finalVersion,
    })),
    // Include updatedAt for optimistic locking
    ...(originalUpdatedAt && {
      updatedAt:
        typeof originalUpdatedAt === "string"
          ? originalUpdatedAt
          : originalUpdatedAt.toISOString(),
    }),
    phases: localPlan.metadata.phases?.map((p) => ({
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
      color: p.color,
    })),
    milestones: localPlan.metadata.milestones?.map((m) => ({
      name: m.name,
      date: m.date,
      description: m.description,
      phaseId: m.phaseId,
    })),
    // Note: cellData has been removed - references are now handled via plan_references table
    references: localPlan.metadata.references?.map((r) => ({
      type: r.type,
      title: r.title,
      url: r.url,
      description: r.description,
      // New reference level fields
      planReferenceTypeId: r.planReferenceTypeId,
      periodDay: r.periodDay,
      calendarDayId: r.calendarDayId,
      phaseId: r.phaseId,
      // Legacy fields
      date: r.date, // Legacy field - deprecated
      ...(r.type === "milestone" &&
        r.milestoneColor && { milestoneColor: r.milestoneColor }),
      // Include files for document type references
      ...(r.type === "document" &&
        r.files && { files: r.files.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          url: f.url,
        })) }),
    })),
  };
}
