import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { In } from "typeorm";
import { Plan, PlanStatus, ReleaseStatus } from "../domain/plan.entity";
import { PlanPhase } from "../domain/plan-phase.entity";
import { PlanTask } from "../domain/plan-task.entity";
import { PlanMilestone } from "../domain/plan-milestone.entity";
import {
  PlanReference,
  PlanReferenceContentType,
} from "../domain/plan-reference.entity";
import { PlanReferenceType } from "../domain/plan-reference-type.entity";
import { PhaseReschedule } from "../domain/phase-reschedule.entity";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { PlanResponseDto } from "./dto/plan-response.dto";
import type { IPlanRepository } from "../infrastructure/plan.repository";
import type { IFeatureRepository } from "../../features/infrastructure/feature.repository";
import { Feature, FeatureStatus } from "../../features/domain/feature.entity";
import { ProductComponentVersion } from "../../products/domain/component-version.entity";
import { Product } from "../../products/domain/product.entity";
import { PlanComponentVersion } from "../domain/plan-component-version.entity";
import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/business-exception";
import {
  validateId,
  validateObject,
  validateString,
  validateArray,
  validateDateString,
} from "@rp-release-planner/rp-shared";
import { RescheduleTypeService } from "../../reschedule-types/application/reschedule-type.service";
import { RescheduleType } from "../../reschedule-types/domain/reschedule-type.entity";
import { BasePhaseService } from "../../base-phases/application/base-phase.service";

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);
  private defaultRescheduleTypeId: string | null = null;

  constructor(
    @Inject("IPlanRepository")
    private readonly repository: IPlanRepository,
    @Inject("IFeatureRepository")
    private readonly featureRepository: IFeatureRepository,
    private readonly basePhaseService: BasePhaseService,
    private readonly rescheduleTypeService: RescheduleTypeService
  ) {}

  async findAll(): Promise<PlanResponseDto[]> {
    // Use findAllWithOwnerName to get owner name from it_owners table via JOIN
    const plans = await (this.repository as any).findAllWithOwnerName();
    // Defensive: Handle null/undefined results
    if (!plans) {
      return [];
    }
    return plans
      .filter((plan) => plan !== null && plan !== undefined)
      .map((plan) => new PlanResponseDto(plan));
  }

  async findById(id: string): Promise<PlanResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, "Plan");

    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan", id);
    }
    return new PlanResponseDto(plan);
  }

  async create(dto: CreatePlanDto): Promise<PlanResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, "CreatePlanDto");
    validateString(dto.name, "Plan name");
    // Removed: owner field validation - use itOwner field instead
    validateDateString(dto.startDate, "Start date");
    validateDateString(dto.endDate, "End date");

    // Validate required fields
    if (!dto.status) {
      throw new Error("Status is required");
    }
    if (!dto.productId) {
      throw new Error("Product ID is required");
    }

    // Defensive: Validate date logic
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (startDate >= endDate) {
      throw new Error("End date must be after start date");
    }

    // Normalize plan name: trim and normalize multiple spaces
    const normalizedName = dto.name.trim().replace(/\s+/g, " ");

    console.log(`[PlanService.create] Checking name uniqueness:`, {
      original: dto.name,
      normalized: normalizedName,
      normalizedLower: normalizedName.toLowerCase(),
    });

    // Check name uniqueness (case-insensitive and space-normalized)
    const existing = await this.repository.findByName(normalizedName);
    if (existing) {
      console.log(`[PlanService.create] Duplicate found:`, {
        searched: normalizedName,
        searchedLower: normalizedName.toLowerCase(),
        existingId: existing.id,
        existingName: existing.name,
        existingNormalized: existing.name.trim().replace(/\s+/g, " "),
        existingLower: existing.name.trim().replace(/\s+/g, " ").toLowerCase(),
      });
      throw new ConflictException(
        `Ya existe un plan con el nombre "${existing.name}". Por favor, usa un nombre diferente.`,
        "DUPLICATE_PLAN_NAME"
      );
    }

    // Create plan with normalized name (owner field removed - use itOwner instead)
    // Default releaseStatus to "To Be Defined" if not provided
    const plan = new Plan(
      normalizedName,
      dto.startDate,
      dto.endDate,
      dto.status,
      dto.description,
      dto.releaseStatus || ReleaseStatus.TO_BE_DEFINED
    );

    if (dto.description) {
      plan.description = dto.description;
    }
    validateId(dto.productId, "Product");
    plan.productId = dto.productId;
    if (dto.itOwner) {
      validateId(dto.itOwner, "IT Owner");
      plan.itOwner = dto.itOwner;
    }
    if (dto.leadId) {
      validateId(dto.leadId, "Lead");
      plan.leadId = dto.leadId;
    }
    if (dto.featureIds) {
      validateArray(dto.featureIds, "Feature IDs");
      dto.featureIds.forEach((fid) => validateId(fid, "Feature"));
      plan.featureIds = dto.featureIds;
    }
    if (dto.calendarIds) {
      validateArray(dto.calendarIds, "Calendar IDs");
      dto.calendarIds.forEach((cid) => validateId(cid, "Calendar"));
      plan.calendarIds = dto.calendarIds;
    }
    if (dto.indicatorIds) {
      validateArray(dto.indicatorIds, "Indicator IDs");
      dto.indicatorIds.forEach((iid) => validateId(iid, "Indicator"));
      plan.indicatorIds = dto.indicatorIds;
    }
    if (dto.teamIds) {
      validateArray(dto.teamIds, "Team IDs");
      dto.teamIds.forEach((tid) => validateId(tid, "Team"));
      plan.teamIds = dto.teamIds;
      console.log("[PlanService.create] Setting teamIds:", {
        teamIds: dto.teamIds,
        teamIdsCount: dto.teamIds.length,
      });
    }

    // Add phases: use provided phases or default phases from maintenance
    if (dto.phases && dto.phases.length > 0) {
      // Use provided phases with sequence
      validateArray(dto.phases, "Phases");
      dto.phases.forEach((p, index) => {
        // Defensive: Validate phase data
        if (!p || !p.name) {
          throw new Error("Phase name is required");
        }
        validateString(p.name, "Phase name");
        if (p.startDate) validateDateString(p.startDate, "Phase start date");
        if (p.endDate) validateDateString(p.endDate, "Phase end date");
        const phase = new PlanPhase(
          p.name,
          p.startDate,
          p.endDate,
          p.color,
          p.metricValues,
          p.sequence !== undefined ? p.sequence : index + 1 // Use provided sequence or assign sequential number
        );
        plan.addPhase(phase);
      });
    } else {
      // No phases provided - use default phases from maintenance
      // findAll() already returns phases ordered by sequence
      const defaultPhases = await this.basePhaseService.findAll();
      const phasesToAdd = defaultPhases.filter((phase) => phase.isDefault);

      if (phasesToAdd.length > 0) {
        console.log(
          `[PlanService.create] Adding ${phasesToAdd.length} default phases to plan with their maintenance sequence`
        );
        phasesToAdd.forEach((defaultPhase, index) => {
          // Use the sequence from maintenance, or fallback to index + 1 if not set
          const sequence =
            defaultPhase.sequence !== undefined &&
            defaultPhase.sequence !== null
              ? defaultPhase.sequence
              : index + 1;

          console.log(
            `[PlanService.create] Adding phase "${defaultPhase.name}" with sequence ${sequence}`
          );

          const phase = new PlanPhase(
            defaultPhase.name,
            undefined, // No dates by default
            undefined,
            defaultPhase.color,
            {},
            sequence // Use sequence from maintenance
          );
          plan.addPhase(phase);
        });
      }
    }

    const created = await this.repository.create(plan);

    console.log(`[PlanService.create] Plan created successfully:`, {
      id: created?.id,
      name: created?.name,
      normalizedName: created?.name?.trim().replace(/\s+/g, " ").toLowerCase(),
    });

    // Defensive: Validate creation result
    if (!created) {
      throw new Error("Failed to create plan");
    }

    const response = new PlanResponseDto(created);
    console.log(`[PlanService.create] Returning PlanResponseDto:`, {
      id: response.id,
      name: response.name,
    });

    return response;
  }

  async update(id: string, dto: UpdatePlanDto): Promise<PlanResponseDto> {
    // Defensive: Validate inputs
    validateId(id, "Plan");
    validateObject(dto, "UpdatePlanDto");

    // Log phases data for debugging
    if (dto.phases) {
      console.log("[PlanService.update] Received phases:", {
        count: dto.phases.length,
        phases: dto.phases.map((p: any) => ({
          name: p.name,
          hasMetricValues: !!p.metricValues,
          metricValues: p.metricValues,
          metricValuesType: typeof p.metricValues,
          isArray: Array.isArray(p.metricValues),
        })),
      });
    }

    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan", id);
    }

    // Optimistic locking: Check if plan was modified since client last fetched it
    if (dto.updatedAt) {
      const clientUpdatedAt = new Date(dto.updatedAt);
      const serverUpdatedAt = new Date(plan.updatedAt);

      // Allow small time difference for clock skew (1 second tolerance)
      const timeDiff = Math.abs(
        serverUpdatedAt.getTime() - clientUpdatedAt.getTime()
      );
      if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
        throw new ConflictException(
          "Plan was modified by another user. Please refresh and try again.",
          "CONCURRENT_MODIFICATION"
        );
      }
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== plan.name) {
      validateString(dto.name, "Plan name");

      // Normalize plan name: trim and normalize multiple spaces
      const normalizedName = dto.name.trim().replace(/\s+/g, " ");

      // Only check uniqueness if normalized name is different from current plan's normalized name
      const currentNormalizedName = plan.name.trim().replace(/\s+/g, " ");
      if (
        normalizedName.toLowerCase() !== currentNormalizedName.toLowerCase()
      ) {
        const existing = await this.repository.findByName(normalizedName);
        if (existing && existing.id !== id) {
          throw new ConflictException(
            `Plan with name "${normalizedName}" already exists`,
            "DUPLICATE_PLAN_NAME"
          );
        }
        // Update with normalized name
        plan.name = normalizedName;
      }
    }

    // Defensive: Validate date logic if dates are being updated
    if (dto.startDate !== undefined && dto.endDate !== undefined) {
      validateDateString(dto.startDate, "Start date");
      validateDateString(dto.endDate, "End date");
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);
      if (startDate >= endDate) {
        throw new Error("End date must be after start date");
      }
    } else if (dto.startDate !== undefined) {
      validateDateString(dto.startDate, "Start date");
      const startDate = new Date(dto.startDate);
      const endDate = new Date(plan.endDate);
      if (startDate >= endDate) {
        throw new Error("Start date must be before end date");
      }
    } else if (dto.endDate !== undefined) {
      validateDateString(dto.endDate, "End date");
      const startDate = new Date(plan.startDate);
      const endDate = new Date(dto.endDate);
      if (startDate >= endDate) {
        throw new Error("End date must be after start date");
      }
    }

    // Update basic fields
    if (dto.name !== undefined) {
      validateString(dto.name, "Plan name");
      plan.name = dto.name;
    }
    // Removed: owner field - use itOwner field instead and join with owners table
    if (dto.startDate !== undefined) {
      plan.startDate = dto.startDate;
    }
    if (dto.endDate !== undefined) {
      plan.endDate = dto.endDate;
    }
    if (dto.status !== undefined) {
      plan.status = dto.status;
    }
    if (dto.releaseStatus !== undefined) {
      plan.releaseStatus = dto.releaseStatus;
    }
    if (dto.description !== undefined) {
      plan.description = dto.description;
    }
    if (dto.productId !== undefined) {
      validateId(dto.productId, "Product");
      plan.productId = dto.productId;
    }
    if (dto.itOwner !== undefined) {
      validateId(dto.itOwner, "IT Owner");
      plan.itOwner = dto.itOwner;
    }
    if (dto.leadId !== undefined) {
      validateId(dto.leadId, "Lead");
      plan.leadId = dto.leadId;
    }
    if (dto.featureIds !== undefined) {
      validateArray(dto.featureIds, "Feature IDs");
      dto.featureIds.forEach((fid) => validateId(fid, "Feature"));
      plan.featureIds = dto.featureIds;
    }
    if (dto.calendarIds !== undefined) {
      validateArray(dto.calendarIds, "Calendar IDs");
      dto.calendarIds.forEach((cid) => validateId(cid, "Calendar"));
      plan.calendarIds = dto.calendarIds;
    }
    if (dto.indicatorIds !== undefined) {
      validateArray(dto.indicatorIds, "Indicator IDs");
      dto.indicatorIds.forEach((iid) => validateId(iid, "Indicator"));
      plan.indicatorIds = dto.indicatorIds;
    }
    if (dto.teamIds !== undefined) {
      validateArray(dto.teamIds, "Team IDs");
      dto.teamIds.forEach((tid) => validateId(tid, "Team"));
      plan.teamIds = dto.teamIds;
      console.log("[PlanService.update] Setting teamIds:", {
        teamIds: dto.teamIds,
        teamIdsCount: dto.teamIds.length,
      });
    }
    if (dto.components !== undefined) {
      validateArray(dto.components, "Components");
      this.logger.log(
        `[PlanService.update] Validating ${dto.components.length} components`
      );
      this.logger.debug(
        `[PlanService.update] Components data: ${JSON.stringify(
          dto.components,
          null,
          2
        )}`
      );
      dto.components.forEach((comp, index) => {
        this.logger.debug(
          `[PlanService.update] Validating component ${index}:`,
          {
            comp,
            hasComponentId: !!comp?.componentId,
            hasCurrentVersion: !!comp?.currentVersion,
            hasFinalVersion: !!comp?.finalVersion,
            componentId: comp?.componentId,
            currentVersion: comp?.currentVersion,
            finalVersion: comp?.finalVersion,
          }
        );
        if (
          !comp ||
          !comp.componentId ||
          !comp.currentVersion ||
          !comp.finalVersion
        ) {
          this.logger.error(
            `[PlanService.update] Invalid component at index ${index}:`,
            {
              comp,
              componentId: comp?.componentId,
              currentVersion: comp?.currentVersion,
              finalVersion: comp?.finalVersion,
            }
          );
          throw new BadRequestException(
            `Invalid component data at index ${index}: componentId=${
              comp?.componentId || "undefined"
            }, currentVersion=${
              comp?.currentVersion || "undefined"
            }, finalVersion=${comp?.finalVersion || "undefined"}`
          );
        }
        validateId(comp.componentId, "Component");
        validateString(comp.currentVersion, "Current version");
        validateString(comp.finalVersion, "Final version");

        // Validate that finalVersion is greater than currentVersion
        // Load product to get component currentVersion
        if (plan.productId) {
          const planRepo = this.repository as any;
          if (planRepo.repository && planRepo.repository.manager) {
            // Use a synchronous check if possible, or validate after loading product
            // For now, we'll validate in the transaction when creating version history
            // But we can add a quick validation here if product is already loaded
          }
        }
      });

      // Store previous components for version history comparison
      const previousComponents = plan.components || [];
      const previousComponentsMap = new Map(
        previousComponents.map((c) => [c.componentId, c.finalVersion])
      );

      // Update plan components - ensure we're assigning the full array with all required fields
      this.logger.debug(`[PlanService.update] Assigning components to plan:`, {
        planId: plan.id,
        previousComponentsCount: previousComponents.length,
        newComponentsCount: dto.components.length,
        newComponents: dto.components.map((c) => ({
          componentId: c.componentId,
          currentVersion: c.currentVersion,
          finalVersion: c.finalVersion,
        })),
      });

      // Explicitly assign the components array - TypeORM should detect this change
      plan.components = dto.components.map((c) => ({
        componentId: c.componentId,
        currentVersion: c.currentVersion,
        finalVersion: c.finalVersion,
      }));

      this.logger.debug(
        `[PlanService.update] Plan components after assignment:`,
        {
          planId: plan.id,
          componentsCount: plan.components?.length || 0,
          components:
            plan.components?.map((c: any) => ({
              componentId: c.componentId,
              currentVersion: c.currentVersion,
              finalVersion: c.finalVersion,
            })) || [],
        }
      );

      // Create version history records for new or changed components
      // Access EntityManager through repository for transactional operations
      // Note: Version history is supplementary - if it fails, plan update should still succeed
      const planRepo = this.repository as any;
      if (
        planRepo.repository &&
        planRepo.repository.manager &&
        plan.productId &&
        dto.components &&
        dto.components.length > 0
      ) {
        // Use transaction to ensure atomicity - await to ensure it completes before saving plan
        // But don't fail the entire update if version history fails
        try {
          await planRepo.repository.manager.transaction(
            async (transactionalEntityManager) => {
              // Load product to get component currentVersions
              const product = await transactionalEntityManager.findOne(
                Product,
                {
                  where: { id: plan.productId } as any,
                  relations: ["components"],
                }
              );

              if (product && product.components) {
                const componentMap = new Map(
                  product.components.map((c) => [c.id, c.currentVersion || ""])
                );

                /**
                 * Normalizes version to full format for comparison: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
                 */
                const normalizeVersion = (version: string): string => {
                  if (!version || version.trim().length === 0) return "0.0.0.0";
                  const parts = version
                    .trim()
                    .split(".")
                    .map((p) => parseInt(p, 10) || 0);
                  while (parts.length < 4) {
                    parts.push(0);
                  }
                  return parts.slice(0, 4).join(".");
                };

                /**
                 * Compares two semantic versions
                 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
                 */
                const compareVersions = (v1: string, v2: string): number => {
                  const normalized1 = normalizeVersion(v1);
                  const normalized2 = normalizeVersion(v2);
                  const parts1 = normalized1
                    .split(".")
                    .map((p) => parseInt(p, 10));
                  const parts2 = normalized2
                    .split(".")
                    .map((p) => parseInt(p, 10));

                  for (let i = 0; i < 4; i++) {
                    if (parts1[i] < parts2[i]) return -1;
                    if (parts1[i] > parts2[i]) return 1;
                  }
                  return 0;
                };

                for (const newComp of dto.components) {
                  try {
                    const component = product.components.find(
                      (c) => c.id === newComp.componentId
                    );
                    if (!component) {
                      console.warn(
                        `Component ${newComp.componentId} not found in product ${plan.productId}`
                      );
                      continue;
                    }

                    const currentVersion = component.currentVersion || "";
                    const previousVersion = previousComponentsMap.get(
                      newComp.componentId
                    );

                    // Validate that finalVersion is greater than product's currentVersion
                    // BUT: If component was already in plan, allow if finalVersion > previousVersion
                    // (this handles the case where product was already updated from a previous save)
                    const comparison = compareVersions(
                      newComp.finalVersion,
                      currentVersion
                    );
                    const isUpdate =
                      previousVersion &&
                      compareVersions(newComp.finalVersion, previousVersion) >
                        0;

                    // Allow if:
                    // 1. finalVersion > currentVersion (normal case - new component or product not updated yet)
                    // 2. OR component was already in plan and finalVersion > previousVersion (updating existing component)
                    if (comparison <= 0 && !isUpdate) {
                      // More detailed error message
                      const componentName =
                        component.name || newComp.componentId;
                      const errorMsg = previousVersion
                        ? `La versión final del componente "${componentName}" (${newComp.finalVersion}) debe ser mayor que la versión actual del producto (${currentVersion}). Versión anterior en el plan: ${previousVersion}`
                        : `La versión final del componente "${componentName}" (${newComp.finalVersion}) debe ser mayor que la versión actual del producto (${currentVersion})`;
                      console.error(`Component version validation failed:`, {
                        componentId: newComp.componentId,
                        componentName,
                        finalVersion: newComp.finalVersion,
                        currentVersion,
                        previousVersion,
                        comparison,
                        isUpdate,
                      });
                      // Use BadRequestException to ensure proper HTTP error response
                      throw new BadRequestException(errorMsg);
                    }

                    // Only create history record if:
                    // 1. Component is new (not in previous list), OR
                    // 2. Component version changed
                    if (
                      !previousVersion ||
                      previousVersion !== newComp.finalVersion
                    ) {
                      // Get oldVersion:
                      // - If component was already in plan, use previous finalVersion
                      // - If component is new, use currentVersion from product
                      const oldVersion =
                        previousVersion || currentVersion || "";

                      // Defensive: Ensure oldVersion is not empty (validation requires it)
                      // If oldVersion is empty, use finalVersion as fallback (for new components)
                      const finalOldVersion =
                        oldVersion && oldVersion.trim().length > 0
                          ? oldVersion.trim()
                          : newComp.finalVersion || "0.0.0.0";

                      // Ensure newVersion is not empty
                      const finalNewVersion =
                        newComp.finalVersion &&
                        newComp.finalVersion.trim().length > 0
                          ? newComp.finalVersion.trim()
                          : "0.0.0.0";

                      if (
                        !finalOldVersion ||
                        finalOldVersion.trim().length === 0 ||
                        !finalNewVersion ||
                        finalNewVersion.trim().length === 0
                      ) {
                        console.warn(
                          `Skipping version history for component ${newComp.componentId}: invalid versions`,
                          {
                            oldVersion: finalOldVersion,
                            newVersion: finalNewVersion,
                          }
                        );
                        continue;
                      }

                      // Validate all required fields before creating entity
                      if (!plan.id || !plan.productId || !newComp.componentId) {
                        console.error(
                          `[PlanService.update] Missing required fields for version history:`,
                          {
                            planId: plan.id,
                            productId: plan.productId,
                            componentId: newComp.componentId,
                          }
                        );
                        throw new Error(
                          `Missing required fields for component version history: planId=${plan.id}, productId=${plan.productId}, componentId=${newComp.componentId}`
                        );
                      }

                      try {
                        console.log(
                          `[PlanService.update] Creating PlanComponentVersion:`,
                          {
                            planId: plan.id,
                            productId: plan.productId,
                            componentId: newComp.componentId,
                            oldVersion: finalOldVersion,
                            newVersion: finalNewVersion,
                          }
                        );

                        const versionHistory = new PlanComponentVersion(
                          plan.id,
                          plan.productId,
                          newComp.componentId,
                          finalOldVersion,
                          finalNewVersion
                        );

                        console.log(
                          `[PlanService.update] Saving version history:`,
                          {
                            planId: plan.id,
                            productId: plan.productId,
                            componentId: newComp.componentId,
                            oldVersion: finalOldVersion,
                            newVersion: newComp.finalVersion,
                          }
                        );

                        await transactionalEntityManager.save(
                          PlanComponentVersion,
                          versionHistory
                        );
                      } catch (versionHistoryError) {
                        console.error(
                          `[PlanService.update] Error saving version history:`,
                          {
                            error: versionHistoryError,
                            planId: plan.id,
                            productId: plan.productId,
                            componentId: newComp.componentId,
                            oldVersion: finalOldVersion,
                            newVersion: newComp.finalVersion,
                          }
                        );
                        throw versionHistoryError; // Re-throw to fail transaction
                      }
                    }
                  } catch (componentError) {
                    // If it's a validation error (BadRequestException or Error with 'debe ser mayor'), throw it to fail the entire transaction
                    if (
                      componentError instanceof BadRequestException ||
                      (componentError instanceof Error &&
                        componentError.message.includes("debe ser mayor"))
                    ) {
                      throw componentError;
                    }
                    // Log other errors for this component but continue with others
                    console.error(
                      `Error saving version history for component ${newComp.componentId}:`,
                      componentError
                    );
                    // Don't throw - continue with other components
                  }
                }
              } else {
                console.warn(
                  `Product ${plan.productId} not found or has no components - skipping version history`
                );
              }
            }
          );
        } catch (error) {
          // If it's a validation error (BadRequestException or Error with 'debe ser mayor'), fail the entire update
          if (
            error instanceof BadRequestException ||
            (error instanceof Error && error.message.includes("debe ser mayor"))
          ) {
            console.error("Component version validation failed:", error);
            throw error; // Throw to fail the entire plan update
          }
          // Log other errors but don't fail the update - version history is supplementary
          console.error(
            "Error saving component version history (non-fatal):",
            error
          );
          // Don't throw - allow plan update to proceed even if version history fails
        }
      }
    }

    // Update phases if provided (replace all phases)
    if (dto.phases !== undefined) {
      validateArray(dto.phases, "Phases");

      // Defensive: Ensure plan.id is available
      if (!plan.id) {
        throw new Error("Plan ID is required to update phases");
      }

      const planRepo = this.repository as any;
      const manager = planRepo.repository?.manager || planRepo.manager;

      if (!manager) {
        this.logger.error(
          `[PlanService.update] Manager not available for plan ${plan.id} - cannot create reschedules`
        );
        throw new Error("Database manager not available for phase updates");
      }

      this.logger.log(
        `[PlanService.update] Processing phases update for plan ${
          plan.id
        }, manager available: ${!!manager}, phases count: ${
          dto.phases?.length || 0
        }`
      );

      // Use transaction to ensure atomicity of phase updates and reschedule creation
      console.log(
        `[PlanService.update] Starting transaction for phase updates and reschedule creation`
      );
      this.logger.log(
        `[PlanService.update] Starting transaction for phase updates and reschedule creation`
      );

      // Track reschedules created during transaction for post-commit verification
      const createdRescheduleIds: string[] = [];

      try {
        await manager.transaction(async (transactionalManager) => {
          console.log(
            `[PlanService.update] Transaction started, getting/creating default reschedule type`
          );
          this.logger.log(
            `[PlanService.update] Transaction started, getting/creating default reschedule type`
          );

          // Get or create default reschedule type within transaction
          const defaultRescheduleType =
            await this.getOrCreateDefaultRescheduleType(transactionalManager);
          console.log(
            `[PlanService.update] Default reschedule type obtained: id=${defaultRescheduleType.id}, name=${defaultRescheduleType.name}`
          );
          this.logger.log(
            `[PlanService.update] Default reschedule type obtained: id=${defaultRescheduleType.id}, name=${defaultRescheduleType.name}`
          );

          // Reload plan with phases within transaction to get latest state
          const planWithPhases = await transactionalManager.findOne(Plan, {
            where: { id: plan.id } as any,
            relations: ["phases"],
          });

          if (!planWithPhases) {
            throw new Error(`Plan ${plan.id} not found in transaction`);
          }

          console.log(
            `[PlanService.update] Plan reloaded with ${
              planWithPhases.phases?.length || 0
            } phases`
          );
          this.logger.log(
            `[PlanService.update] Plan reloaded with ${
              planWithPhases.phases?.length || 0
            } phases`
          );

          // Get existing phases map by ID for comparison
          // Normalize IDs (trim whitespace) to ensure proper matching
          const existingPhasesMap = new Map<string, PlanPhase>();
          if (planWithPhases.phases && planWithPhases.phases.length > 0) {
            planWithPhases.phases.forEach((phase) => {
              if (phase.id) {
                const normalizedId = phase.id.trim();
                existingPhasesMap.set(normalizedId, phase);
                this.logger.debug(
                  `Loaded existing phase ${normalizedId}: name=${phase.name}, startDate=${phase.startDate}, endDate=${phase.endDate}`
                );
              }
            });
          }
          console.log(
            `[PlanService.update] Loaded ${existingPhasesMap.size} existing phases for plan ${plan.id}`
          );
          this.logger.log(
            `[PlanService.update] Loaded ${existingPhasesMap.size} existing phases for plan ${plan.id}`
          );

          // Check for date changes and create reschedules before updating
          const phasesToCreate: PlanPhase[] = [];
          const phasesToUpdate: PlanPhase[] = [];
          const phasesToRemove: PlanPhase[] = [];

          // Process new/updated phases
          console.log(
            `[PlanService.update] Processing ${dto.phases.length} phases from DTO`
          );
          this.logger.log(
            `[PlanService.update] Processing ${dto.phases.length} phases from DTO`
          );
          for (const p of dto.phases) {
            // Defensive: Validate phase data
            if (!p || !p.name) {
              throw new Error("Phase name is required");
            }
            validateString(p.name, "Phase name");
            if (p.startDate)
              validateDateString(p.startDate, "Phase start date");
            if (p.endDate) validateDateString(p.endDate, "Phase end date");

            // Normalize phase ID (trim whitespace and filter temporary IDs)
            let normalizedPhaseId: string | undefined = undefined;
            if (p.id) {
              const trimmedId = p.id.trim();
              // Filter out temporary IDs that start with "phase-" or are empty
              if (trimmedId && !trimmedId.startsWith("phase-")) {
                // Validate that it's a proper UUID if it's not empty
                try {
                  validateId(trimmedId, "Phase");
                  normalizedPhaseId = trimmedId;
                } catch (error) {
                  this.logger.warn(
                    `[PlanService.update] Invalid phase ID format: "${trimmedId}" - treating as new phase`
                  );
                  // Invalid ID format - treat as new phase
                  normalizedPhaseId = undefined;
                }
              } else {
                this.logger.debug(
                  `[PlanService.update] Skipping temporary phaseId: ${trimmedId}`
                );
              }
            }

            this.logger.debug(
              `[PlanService.update] Processing phase: id=${
                normalizedPhaseId || "none"
              }, name=${p.name}, startDate=${p.startDate}, endDate=${
                p.endDate
              }, existsInMap=${
                normalizedPhaseId
                  ? existingPhasesMap.has(normalizedPhaseId)
                  : false
              }`
            );

            // ⚡ CRITICAL: Only update if phase ID exists in map AND is a valid UUID
            // This prevents creating duplicates when IDs don't match
            if (normalizedPhaseId && existingPhasesMap.has(normalizedPhaseId)) {
              // Existing phase - check for date changes
              const existingPhase = existingPhasesMap.get(normalizedPhaseId)!;

              // ⚡ CRITICAL: Log phase IDs to verify matching
              console.log(
                `[PlanService.update] 🔍 PHASE MATCH CHECK: normalizedId="${normalizedPhaseId}", existsInMap=${existingPhasesMap.has(
                  normalizedPhaseId
                )}, existingPhase.id="${existingPhase.id}"`
              );
              this.logger.log(
                `[PlanService.update] 🔍 PHASE MATCH CHECK: normalizedId="${normalizedPhaseId}", existsInMap=${existingPhasesMap.has(
                  normalizedPhaseId
                )}, existingPhase.id="${existingPhase.id}"`
              );

              // Normalize dates for comparison (handle null/undefined and format differences)
              const normalizeDate = (
                date: string | null | undefined
              ): string | null => {
                if (!date) return null;
                // Handle Date objects (though unlikely in this context)
                if (
                  typeof date === "object" &&
                  "toISOString" in date &&
                  typeof (date as any).toISOString === "function"
                ) {
                  return (date as any).toISOString().split("T")[0];
                }
                // Extract just the date part (YYYY-MM-DD) to avoid timezone/time differences
                const dateStr = date.toString().split("T")[0];
                // Also handle cases where date might be in format "YYYY-MM-DD HH:mm:ss"
                const normalized = dateStr.split(" ")[0];
                // Validate format (YYYY-MM-DD)
                if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
                  console.warn(
                    `[PlanService.update] Invalid date format: ${date}, normalized: ${normalized}`
                  );
                  this.logger.warn(
                    `[PlanService.update] Invalid date format: ${date}, normalized: ${normalized}`
                  );
                }
                return normalized || null;
              };

              // Log raw dates before normalization for debugging
              console.log(
                `[PlanService.update] Phase ${
                  p.id
                } RAW dates - existingPhase.startDate=${
                  existingPhase.startDate
                } (type: ${typeof existingPhase.startDate}), existingPhase.endDate=${
                  existingPhase.endDate
                } (type: ${typeof existingPhase.endDate}), p.startDate=${
                  p.startDate
                } (type: ${typeof p.startDate}), p.endDate=${
                  p.endDate
                } (type: ${typeof p.endDate})`
              );
              this.logger.log(
                `[PlanService.update] Phase ${
                  p.id
                } RAW dates - existingPhase.startDate=${
                  existingPhase.startDate
                } (type: ${typeof existingPhase.startDate}), existingPhase.endDate=${
                  existingPhase.endDate
                } (type: ${typeof existingPhase.endDate}), p.startDate=${
                  p.startDate
                } (type: ${typeof p.startDate}), p.endDate=${
                  p.endDate
                } (type: ${typeof p.endDate})`
              );

              const existingStartDate = normalizeDate(existingPhase.startDate);
              const existingEndDate = normalizeDate(existingPhase.endDate);
              const newStartDate = normalizeDate(p.startDate);
              const newEndDate = normalizeDate(p.endDate);

              // ⚡ CRITICAL: Enhanced date change detection with detailed logging
              // Compare normalized dates - handle null/undefined cases
              const startDateChanged =
                (existingStartDate !== null || newStartDate !== null) &&
                existingStartDate !== newStartDate;
              const endDateChanged =
                (existingEndDate !== null || newEndDate !== null) &&
                existingEndDate !== newEndDate;
              const hasDateChange = startDateChanged || endDateChanged;

              console.log(
                `[PlanService.update] 🔍 Phase ${p.id} DETAILED date check:`
              );
              console.log(
                `  - existingStartDate: "${existingStartDate}" (from DB: "${existingPhase.startDate}")`
              );
              console.log(
                `  - newStartDate: "${newStartDate}" (from DTO: "${p.startDate}")`
              );
              console.log(`  - startDateChanged: ${startDateChanged}`);
              console.log(
                `  - existingEndDate: "${existingEndDate}" (from DB: "${existingPhase.endDate}")`
              );
              console.log(
                `  - newEndDate: "${newEndDate}" (from DTO: "${p.endDate}")`
              );
              console.log(`  - endDateChanged: ${endDateChanged}`);
              console.log(`  - hasDateChange: ${hasDateChange}`);

              this.logger.log(
                `[PlanService.update] Phase ${p.id} date check: existing=[${existingStartDate}, ${existingEndDate}], new=[${newStartDate}, ${newEndDate}], hasChange=${hasDateChange}, startChanged=${startDateChanged}, endChanged=${endDateChanged}`
              );

              if (hasDateChange) {
                this.logger.log(
                  `[PlanService.update] 🔍 DETAILED DATE COMPARISON for phase ${p.id}:`
                );
                this.logger.log(
                  `  - existingStartDate: "${existingStartDate}" vs newStartDate: "${newStartDate}" -> ${
                    existingStartDate !== newStartDate ? "DIFFERENT" : "SAME"
                  }`
                );
                this.logger.log(
                  `  - existingEndDate: "${existingEndDate}" vs newEndDate: "${newEndDate}" -> ${
                    existingEndDate !== newEndDate ? "DIFFERENT" : "SAME"
                  }`
                );
              }

              if (hasDateChange) {
                console.log(
                  `[PlanService.update] ⚠️ DATE CHANGE DETECTED for phase ${p.id} - will create reschedule`
                );
                this.logger.log(
                  `[PlanService.update] DATE CHANGE DETECTED for phase ${p.id} - will create reschedule`
                );
                try {
                  console.log(
                    `[PlanService] Creating reschedule for phase ${existingPhase.id}: existing=[${existingStartDate}, ${existingEndDate}], new=[${newStartDate}, ${newEndDate}]`
                  );
                  this.logger.log(
                    `[PlanService] Creating reschedule for phase ${existingPhase.id}: existing=[${existingStartDate}, ${existingEndDate}], new=[${newStartDate}, ${newEndDate}]`
                  );

                  // Always use "Default" reschedule type if not explicitly provided
                  // This ensures atomicity - default type is guaranteed to exist within transaction
                  const rescheduleTypeId =
                    p.rescheduleTypeId || defaultRescheduleType.id;

                  if (!rescheduleTypeId) {
                    throw new Error(
                      "Reschedule type ID is required but default type was not found"
                    );
                  }

                  // Use plan's itOwner as default owner if rescheduleOwnerId is not provided
                  // This ensures that the owner who approved the change is tracked
                  const ownerId =
                    p.rescheduleOwnerId || plan.itOwner || undefined;

                  console.log(
                    `[PlanService.update] Reschedule owner determination: provided=${
                      p.rescheduleOwnerId || "none"
                    }, plan.itOwner=${plan.itOwner || "none"}, final=${
                      ownerId || "none"
                    }`
                  );
                  this.logger.log(
                    `[PlanService.update] Reschedule owner determination: provided=${
                      p.rescheduleOwnerId || "none"
                    }, plan.itOwner=${plan.itOwner || "none"}, final=${
                      ownerId || "none"
                    }`
                  );

                  // Create reschedule record with default type and owner
                  const reschedule = new PhaseReschedule(
                    existingPhase.id,
                    existingPhase.startDate || undefined,
                    existingPhase.endDate || undefined,
                    p.startDate || undefined,
                    p.endDate || undefined,
                    rescheduleTypeId, // Always includes rescheduleTypeId (default or provided)
                    ownerId // Use provided owner or plan's itOwner as default
                  );

                  this.logger.log(
                    `[PlanService.update] Reschedule object created: ${JSON.stringify(
                      {
                        planPhaseId: reschedule.planPhaseId,
                        originalStartDate: reschedule.originalStartDate,
                        originalEndDate: reschedule.originalEndDate,
                        newStartDate: reschedule.newStartDate,
                        newEndDate: reschedule.newEndDate,
                        rescheduleTypeId: reschedule.rescheduleTypeId,
                        ownerId: reschedule.ownerId,
                        rescheduledAt: reschedule.rescheduledAt,
                        ownerSource: p.rescheduleOwnerId
                          ? "provided"
                          : plan.itOwner
                          ? "plan.itOwner"
                          : "none",
                      }
                    )}`
                  );
                  console.log(
                    `[PlanService.update] Reschedule owner: ${ownerId} (source: ${
                      p.rescheduleOwnerId
                        ? "provided"
                        : plan.itOwner
                        ? "plan.itOwner"
                        : "none"
                    })`
                  );

                  // Save reschedule to database within transaction (atomic operation)
                  // This ensures phase update and reschedule creation happen together
                  console.log(
                    `[PlanService.update] Attempting to save reschedule to database using transactionalManager...`
                  );
                  this.logger.log(
                    `[PlanService.update] Attempting to save reschedule to database using transactionalManager...`
                  );

                  try {
                    // Validate that planPhaseId exists before saving
                    const phaseExists = await transactionalManager.findOne(
                      PlanPhase,
                      {
                        where: { id: existingPhase.id } as any,
                      }
                    );

                    if (!phaseExists) {
                      this.logger.error(
                        `[PlanService.update] ❌ Phase ${existingPhase.id} does not exist in database`
                      );
                      throw new Error(
                        `Phase ${existingPhase.id} does not exist - cannot create reschedule`
                      );
                    }

                    this.logger.log(
                      `[PlanService.update] Phase ${existingPhase.id} verified to exist, proceeding with reschedule save`
                    );

                    // Use insert instead of save to ensure it's a new record
                    // Create a plain object for insert (not an entity instance)
                    const rescheduleData = {
                      planPhaseId: reschedule.planPhaseId,
                      originalStartDate: reschedule.originalStartDate || null,
                      originalEndDate: reschedule.originalEndDate || null,
                      newStartDate: reschedule.newStartDate || null,
                      newEndDate: reschedule.newEndDate || null,
                      rescheduleTypeId: reschedule.rescheduleTypeId || null,
                      ownerId: reschedule.ownerId || null,
                      rescheduledAt: reschedule.rescheduledAt || new Date(),
                    };

                    console.log(
                      `[PlanService.update] Inserting reschedule data:`,
                      rescheduleData
                    );
                    this.logger.log(
                      `[PlanService.update] Inserting reschedule data: ${JSON.stringify(
                        rescheduleData
                      )}`
                    );

                    const insertResult = await transactionalManager.insert(
                      PhaseReschedule,
                      rescheduleData
                    );

                    console.log(
                      `[PlanService.update] Insert result:`,
                      insertResult
                    );
                    this.logger.log(
                      `[PlanService.update] Insert result: ${JSON.stringify(
                        insertResult
                      )}`
                    );

                    // Extract ID from insert result
                    const rescheduleId =
                      insertResult.identifiers?.[0]?.id ||
                      insertResult.generatedMaps?.[0]?.id;

                    if (!rescheduleId) {
                      this.logger.error(
                        `[PlanService.update] ❌ Reschedule insert returned no ID. Identifiers: ${JSON.stringify(
                          insertResult.identifiers
                        )}, GeneratedMaps: ${JSON.stringify(
                          insertResult.generatedMaps
                        )}`
                      );
                      throw new Error(
                        "Failed to save reschedule - insert returned no ID"
                      );
                    }

                    console.log(
                      `[PlanService.update] ✅ Phase reschedule INSERTED SUCCESSFULLY for phase ${
                        existingPhase.id
                      }: rescheduleId=${rescheduleId}, rescheduleTypeId=${rescheduleTypeId} (${
                        p.rescheduleTypeId ? "provided" : "default"
                      }), ownerId=${ownerId || "none"} (${
                        p.rescheduleOwnerId
                          ? "provided"
                          : plan.itOwner
                          ? "plan.itOwner"
                          : "none"
                      }), original=[${existingStartDate}, ${existingEndDate}], new=[${newStartDate}, ${newEndDate}]`
                    );
                    this.logger.log(
                      `[PlanService.update] ✅ Phase reschedule INSERTED SUCCESSFULLY for phase ${
                        existingPhase.id
                      }: rescheduleId=${rescheduleId}, rescheduleTypeId=${rescheduleTypeId} (${
                        p.rescheduleTypeId ? "provided" : "default"
                      }), ownerId=${ownerId || "none"} (${
                        p.rescheduleOwnerId
                          ? "provided"
                          : plan.itOwner
                          ? "plan.itOwner"
                          : "none"
                      }), original=[${existingStartDate}, ${existingEndDate}], new=[${newStartDate}, ${newEndDate}]`
                    );

                    // Verify the record was actually saved by querying it back
                    const verifyReschedule = await transactionalManager.findOne(
                      PhaseReschedule,
                      {
                        where: { id: rescheduleId } as any,
                      }
                    );

                    if (!verifyReschedule) {
                      this.logger.error(
                        `[PlanService.update] ❌ Reschedule ${rescheduleId} was not found after insert - transaction may have been rolled back`
                      );
                      throw new Error("Reschedule was not found after insert");
                    }

                    console.log(
                      `[PlanService.update] ✅ Reschedule ${rescheduleId} verified to exist in database (within transaction)`
                    );
                    this.logger.log(
                      `[PlanService.update] ✅ Reschedule ${rescheduleId} verified to exist in database (within transaction)`
                    );

                    // Track reschedule ID for post-commit verification
                    createdRescheduleIds.push(rescheduleId);
                  } catch (saveError: any) {
                    this.logger.error(
                      `[PlanService.update] ❌ Error during save operation: ${saveError?.message}`,
                      saveError?.stack
                    );
                    throw saveError; // Re-throw to be caught by outer catch
                  }
                } catch (error: any) {
                  this.logger.error(
                    `[PlanService.update] ❌ FAILED to save phase reschedule for phase ${
                      existingPhase.id
                    }: ${error?.message || "Unknown error"}`,
                    error?.stack
                  );
                  // IMPORTANT: Re-throw the error to ensure transaction rollback
                  // Reschedule creation is critical and should not be silently ignored
                  throw error;
                }
              } else {
                console.log(
                  `[PlanService.update] ⚠️ No date change detected for phase ${existingPhase.id} - skipping reschedule creation`
                );
                console.log(
                  `[PlanService.update]   - existing: [${existingStartDate}, ${existingEndDate}]`
                );
                console.log(
                  `[PlanService.update]   - new: [${newStartDate}, ${newEndDate}]`
                );
                this.logger.debug(
                  `No date change detected for phase ${existingPhase.id}`
                );
              }

              // Update existing phase (ALWAYS update, even if no date change)
              // This ensures phase data is synchronized
              console.log(
                `[PlanService.update] Updating phase ${existingPhase.id}: name="${p.name}", startDate="${p.startDate}", endDate="${p.endDate}"`
              );
              this.logger.log(
                `[PlanService.update] Updating phase ${existingPhase.id}: name="${p.name}", startDate="${p.startDate}", endDate="${p.endDate}"`
              );

              existingPhase.name = p.name;
              existingPhase.startDate = p.startDate;
              existingPhase.endDate = p.endDate;
              existingPhase.color = p.color;
              existingPhase.metricValues = p.metricValues || {};
              // Update sequence if provided, otherwise preserve existing sequence
              if (p.sequence !== undefined) {
                existingPhase.sequence = p.sequence;
              }
              phasesToUpdate.push(existingPhase);
            } else {
              // New phase (no ID, invalid ID, or temporary ID)
              // ⚡ CRITICAL: If phase has an ID but it's not in the map, log a warning
              // This could indicate a data inconsistency issue
              if (p.id && normalizedPhaseId) {
                this.logger.warn(
                  `[PlanService.update] ⚠️ Phase has valid ID "${normalizedPhaseId}" but not found in existing phases map. This may indicate a data inconsistency. Creating as new phase.`
                );
                console.warn(
                  `[PlanService.update] ⚠️ Phase has valid ID "${normalizedPhaseId}" but not found in existing phases map. Creating as new phase.`
                );
              }

              // Calculate sequence: use provided sequence or assign based on position in array
              const sequence =
                p.sequence !== undefined
                  ? p.sequence
                  : dto.phases!.findIndex((ph) => ph === p) + 1;

              const phase = new PlanPhase(
                p.name,
                p.startDate,
                p.endDate,
                p.color,
                p.metricValues,
                sequence
              );
              phase.planId = planWithPhases.id;
              phasesToCreate.push(phase);
            }
          }

          // Find phases to remove (exist in DB but not in DTO)
          // ⚡ CRITICAL: Normalize DTO phase IDs for comparison to ensure proper matching
          const dtoPhaseIds = new Set<string>();
          dto.phases!.forEach((p) => {
            if (p.id) {
              const trimmedId = p.id.trim();
              // Only include valid UUIDs (not temporary IDs)
              if (trimmedId && !trimmedId.startsWith("phase-")) {
                try {
                  validateId(trimmedId, "Phase");
                  dtoPhaseIds.add(trimmedId);
                } catch {
                  // Invalid ID - skip
                }
              }
            }
          });

          existingPhasesMap.forEach((phase, id) => {
            if (!dtoPhaseIds.has(id)) {
              phasesToRemove.push(phase);
            }
          });

          // Remove phases that are no longer in the DTO
          if (phasesToRemove.length > 0) {
            await transactionalManager.remove(PlanPhase, phasesToRemove);
          }

          // Update existing phases
          if (phasesToUpdate.length > 0) {
            await transactionalManager.save(PlanPhase, phasesToUpdate);
          }

          // Create new phases
          // ⚡ CRITICAL: Do NOT use addPhase() here - it adds to the array and can cause duplicates
          // Just save the phases directly - TypeORM will handle the relation via planId
          if (phasesToCreate.length > 0) {
            console.log(
              `[PlanService.update] Creating ${phasesToCreate.length} new phases for plan ${plan.id}`
            );
            this.logger.log(
              `[PlanService.update] Creating ${phasesToCreate.length} new phases for plan ${plan.id}`
            );
            await transactionalManager.save(PlanPhase, phasesToCreate);
          }

          // ⚡ CRITICAL: Reload plan with phases to get updated phase list
          // This ensures we have the correct phases array without duplicates
          const updatedPlan = await transactionalManager.findOne(Plan, {
            where: { id: plan.id } as any,
            relations: ["phases"],
          });

          if (updatedPlan) {
            plan.phases = updatedPlan.phases;
            console.log(
              `[PlanService.update] Plan ${plan.id} now has ${
                plan.phases?.length || 0
              } phases after update`
            );
            this.logger.log(
              `[PlanService.update] Plan ${plan.id} now has ${
                plan.phases?.length || 0
              } phases after update`
            );
          }

          this.logger.log(
            `[PlanService.update] Transaction completed successfully for plan ${plan.id}`
          );
        });

        console.log(
          `[PlanService.update] ✅ Phase update transaction COMMITTED for plan ${plan.id}`
        );
        this.logger.log(
          `[PlanService.update] ✅ Phase update transaction COMMITTED for plan ${plan.id}`
        );

        // ⚡ CRITICAL: Verify reschedules were actually persisted after transaction commit
        if (createdRescheduleIds.length > 0) {
          console.log(
            `[PlanService.update] 🔍 Verifying ${createdRescheduleIds.length} reschedules were persisted after commit...`
          );
          this.logger.log(
            `[PlanService.update] Verifying ${createdRescheduleIds.length} reschedules were persisted after commit`
          );

          for (const rescheduleId of createdRescheduleIds) {
            try {
              // Use QueryBuilder to avoid relation inference issues
              const persistedReschedule = await manager
                .createQueryBuilder(PhaseReschedule, "reschedule")
                .leftJoinAndSelect(
                  "reschedule.rescheduleType",
                  "rescheduleType"
                )
                .leftJoinAndSelect("reschedule.owner", "owner")
                .where("reschedule.id = :id", { id: rescheduleId })
                .getOne();

              if (persistedReschedule) {
                console.log(
                  `[PlanService.update] ✅ VERIFIED: Reschedule ${rescheduleId} PERSISTED in database after commit`
                );
                console.log(
                  `[PlanService.update]   - planPhaseId: ${persistedReschedule.planPhaseId}`
                );
                console.log(
                  `[PlanService.update]   - originalStartDate: ${persistedReschedule.originalStartDate}`
                );
                console.log(
                  `[PlanService.update]   - originalEndDate: ${persistedReschedule.originalEndDate}`
                );
                console.log(
                  `[PlanService.update]   - newStartDate: ${persistedReschedule.newStartDate}`
                );
                console.log(
                  `[PlanService.update]   - newEndDate: ${persistedReschedule.newEndDate}`
                );
                console.log(
                  `[PlanService.update]   - rescheduleTypeId: ${persistedReschedule.rescheduleTypeId}`
                );
                console.log(
                  `[PlanService.update]   - ownerId: ${
                    persistedReschedule.ownerId || "none"
                  }`
                );
                console.log(
                  `[PlanService.update]   - rescheduledAt: ${persistedReschedule.rescheduledAt}`
                );
                this.logger.log(
                  `[PlanService.update] ✅ VERIFIED: Reschedule ${rescheduleId} PERSISTED in database after commit`
                );
              } else {
                console.error(
                  `[PlanService.update] ❌ CRITICAL: Reschedule ${rescheduleId} NOT FOUND in database after commit!`
                );
                this.logger.error(
                  `[PlanService.update] ❌ CRITICAL: Reschedule ${rescheduleId} NOT FOUND in database after commit!`
                );
              }
            } catch (verifyError: any) {
              console.error(
                `[PlanService.update] ❌ Error verifying reschedule ${rescheduleId}: ${verifyError?.message}`
              );
              this.logger.error(
                `[PlanService.update] Error verifying reschedule ${rescheduleId}: ${verifyError?.message}`,
                verifyError?.stack
              );
            }
          }
        } else {
          console.log(
            `[PlanService.update] ℹ️ No reschedules were created in this update`
          );
          this.logger.log(
            `[PlanService.update] No reschedules were created in this update`
          );
        }
      } catch (transactionError: any) {
        console.error(
          `[PlanService.update] ❌ TRANSACTION FAILED for plan ${plan.id}:`,
          transactionError?.message,
          transactionError?.stack
        );
        this.logger.error(
          `[PlanService.update] ❌ TRANSACTION FAILED for plan ${plan.id}: ${transactionError?.message}`,
          transactionError?.stack
        );
        throw transactionError; // Re-throw to fail the update
      }
    }

    // Update tasks if provided (replace all tasks)
    if (dto.tasks !== undefined) {
      validateArray(dto.tasks, "Tasks");
      plan.tasks = [];
      dto.tasks.forEach((t) => {
        // Defensive: Validate task data
        if (!t || !t.title || !t.startDate || !t.endDate) {
          throw new Error("Task title, start date, and end date are required");
        }
        validateString(t.title, "Task title");
        validateDateString(t.startDate, "Task start date");
        validateDateString(t.endDate, "Task end date");
        const taskStart = new Date(t.startDate);
        const taskEnd = new Date(t.endDate);
        if (taskStart >= taskEnd) {
          throw new Error("Task end date must be after start date");
        }
        const task = new PlanTask(t.title, t.startDate, t.endDate, t.color);
        plan.addTask(task);
      });
    }

    // Update references if provided (replace all references)
    // IMPORTANT: Also sync milestones from milestone-type references
    // Process references FIRST to collect milestone references before processing explicit milestones
    let milestoneReferencesFromRefs: Array<{
      date: string;
      name: string;
      description?: string;
      phaseId?: string;
    }> = [];

    if (dto.references !== undefined) {
      validateArray(dto.references, "References");

      // IMPORTANT: TypeORM requires explicit deletion of existing references before replacing
      // Simply setting plan.references = [] doesn't delete from database
      if (plan.references && plan.references.length > 0) {
        // Remove existing references from database
        const planRepo = this.repository as any;
        if (planRepo.repository && planRepo.repository.manager) {
          await planRepo.repository.manager.remove(
            PlanReference,
            plan.references
          );
        } else {
          // Fallback: use repository's manager directly if available
          const repo = (this.repository as any).repository;
          if (repo && repo.manager) {
            await repo.manager.remove(PlanReference, plan.references);
          }
        }
      }

      // Now create new references array
      plan.references = [];

      // Collect milestone references to sync with plan.milestones
      // Use a Set to track unique milestone keys to prevent duplicates
      const milestoneReferences: Array<{
        date: string;
        name: string;
        description?: string;
        phaseId?: string;
      }> = [];
      const milestoneKeys = new Set<string>();

      // Process references sequentially to allow async operations
      for (const r of dto.references) {
        // Defensive: Validate reference data
        if (!r || !r.type || !r.title) {
          throw new Error("Reference type and title are required");
        }
        validateString(r.type, "Reference type");
        validateString(r.title, "Reference title");
        if (r.date) validateDateString(r.date, "Reference date");

        // Validate phaseId if provided (must be a valid UUID, not a temporary ID like "phase-..." or empty string)
        let validPhaseId: string | undefined = undefined;
        if (
          r.phaseId &&
          typeof r.phaseId === "string" &&
          r.phaseId.trim() !== ""
        ) {
          const trimmedPhaseId = r.phaseId.trim();
          // Filter out temporary IDs that start with "phase-"
          if (trimmedPhaseId.startsWith("phase-")) {
            console.warn(
              `[PlanService.update] Skipping temporary phaseId: ${trimmedPhaseId}`
            );
            validPhaseId = undefined;
          } else {
            validateId(trimmedPhaseId, "Phase");
            validPhaseId = trimmedPhaseId;
          }
        }

        // If this is a milestone reference with date, collect it for milestone sync
        // Deduplicate based on phaseId-date key to prevent duplicate milestones
        if (r.type === "milestone" && r.date) {
          const milestoneKey = `${validPhaseId || ""}-${r.date}`;
          if (!milestoneKeys.has(milestoneKey)) {
            milestoneKeys.add(milestoneKey);
            milestoneReferences.push({
              date: r.date,
              name: r.title,
              description: r.description,
              phaseId: validPhaseId, // Use validated phaseId
            });
          } else {
            this.logger.warn(
              `[PlanService.update] Skipping duplicate milestone reference: ${milestoneKey}`
            );
          }
        }

        // Determine planReferenceTypeId based on provided fields
        // Default to 'plan' if not specified
        let planReferenceTypeId = r.planReferenceTypeId;
        if (!planReferenceTypeId) {
          // Get repository manager to query plan_reference_type
          const planRepo = this.repository as any;
          const manager = planRepo.repository?.manager || planRepo.manager;

          if (!manager) {
            throw new Error("Repository manager not available");
          }

          const PlanReferenceTypeEntity =
            require("../domain/plan-reference-type.entity").PlanReferenceType;

          // Try to infer from provided fields
          if (r.calendarDayId && validPhaseId) {
            // Day level: has calendarDayId and phaseId
            // Need to fetch 'day' type ID
            const dayType = await manager.findOne(PlanReferenceTypeEntity, {
              where: { name: "day" } as any,
            });
            if (dayType) {
              planReferenceTypeId = dayType.id;
            }
          } else if (r.periodDay) {
            // Period level: has periodDay
            const periodType = await manager.findOne(PlanReferenceTypeEntity, {
              where: { name: "period" } as any,
            });
            if (periodType) {
              planReferenceTypeId = periodType.id;
            }
          } else {
            // Plan level: default
            const planType = await manager.findOne(PlanReferenceTypeEntity, {
              where: { name: "plan" } as any,
            });
            if (planType) {
              planReferenceTypeId = planType.id;
            }
          }
        }

        // If still no planReferenceTypeId, throw error
        if (!planReferenceTypeId) {
          throw new Error("Plan reference type is required");
        }

        const reference = new PlanReference(
          r.type as PlanReferenceContentType,
          r.title,
          r.url,
          r.description,
          planReferenceTypeId,
          r.periodDay,
          r.calendarDayId,
          validPhaseId, // Use validated phaseId (can be undefined for NULL in DB)
          r.date, // Legacy date field
          (r as any).milestoneColor // Include milestoneColor for milestone type references
        );
        reference.planId = plan.id;

        // Explicitly set phaseId to ensure it's saved (even if undefined, TypeORM will save as NULL)
        // This is important because the constructor only sets phaseId if it's not undefined
        // But we want to ensure it's explicitly set (or null) for proper database storage
        if (validPhaseId === undefined) {
          // Explicitly set to null to ensure database stores NULL instead of potentially skipping the field
          (reference as any).phaseId = null;
        }

        // Log for debugging
        if (r.type === "milestone" && r.date) {
          this.logger.log(
            `[PlanService.update] Creating milestone reference:`,
            {
              title: r.title,
              date: r.date,
              phaseId: validPhaseId || null,
              originalPhaseId: r.phaseId,
              milestoneColor: (r as any).milestoneColor,
              referencePhaseId: reference.phaseId,
            }
          );
        }
        if (!plan.references) plan.references = [];
        plan.references.push(reference);
      }

      // Sync milestones from milestone-type references
      // IMPORTANT: When saving references tab, milestones from milestone-type references
      // should always be synced to plan_milestones table
      if (milestoneReferences.length > 0) {
        // IMPORTANT: TypeORM requires explicit deletion of existing milestones before replacing
        // Simply setting plan.milestones = [] doesn't delete from database
        if (plan.milestones && plan.milestones.length > 0) {
          // Save existing milestones to a temporary array before clearing
          const existingMilestones = [...plan.milestones];

          // Clear plan.milestones FIRST to prevent TypeORM from trying to save them
          plan.milestones = [];

          // Remove existing milestones from database
          const planRepo = this.repository as any;
          if (planRepo.repository && planRepo.repository.manager) {
            await planRepo.repository.manager.remove(
              PlanMilestone,
              existingMilestones
            );
          } else {
            // Fallback: use repository's manager directly if available
            const repo = (this.repository as any).repository;
            if (repo && repo.manager) {
              await repo.manager.remove(PlanMilestone, existingMilestones);
            }
          }
        } else {
          // Ensure milestones array is initialized
          plan.milestones = [];
        }

        // When milestone references are present, use them as the ONLY source of truth
        // The frontend may also send dto.milestones extracted from references, but we should
        // IGNORE them to avoid duplicates. Milestones are created ONLY from milestone references.
        milestoneReferences.forEach((m) => {
          const milestone = new PlanMilestone(
            m.date,
            m.name,
            m.description,
            m.phaseId
          );
          milestone.planId = plan.id;
          plan.milestones.push(milestone);
        });

        // IMPORTANT: When milestone references are present, ignore dto.milestones completely
        // to prevent duplicates. The milestones are already created from references above.
      }
    }

    // Update milestones explicitly if provided (separate from references)
    // This handles the case where dto.milestones is provided but dto.references is not or doesn't contain milestone references
    // Only process if references were not provided OR references were provided but didn't contain milestone references
    const hasMilestoneReferences =
      dto.references !== undefined &&
      dto.references.some((r) => r.type === "milestone" && r.date);

    if (dto.milestones !== undefined && !hasMilestoneReferences) {
      validateArray(dto.milestones, "Milestones");

      // IMPORTANT: TypeORM requires explicit deletion of existing milestones before replacing
      // Simply setting plan.milestones = [] doesn't delete from database
      if (plan.milestones && plan.milestones.length > 0) {
        // Save existing milestones to a temporary array before clearing
        const existingMilestones = [...plan.milestones];

        // Clear plan.milestones FIRST to prevent TypeORM from trying to save them
        plan.milestones = [];

        // Remove existing milestones from database
        const planRepo = this.repository as any;
        if (planRepo.repository && planRepo.repository.manager) {
          await planRepo.repository.manager.remove(
            PlanMilestone,
            existingMilestones
          );
        } else {
          // Fallback: use repository's manager directly if available
          const repo = (this.repository as any).repository;
          if (repo && repo.manager) {
            await repo.manager.remove(PlanMilestone, existingMilestones);
          }
        }
      } else {
        // Ensure milestones array is initialized
        plan.milestones = [];
      }

      // Create new milestones array
      dto.milestones.forEach((m) => {
        // Defensive: Validate milestone data
        if (!m || !m.date || !m.name) {
          throw new Error("Milestone date and name are required");
        }
        validateDateString(m.date, "Milestone date");
        validateString(m.name, "Milestone name");
        if (m.phaseId) validateId(m.phaseId, "Phase");

        const milestone = new PlanMilestone(
          m.date,
          m.name,
          m.description,
          m.phaseId
        );
        milestone.planId = plan.id;
        plan.milestones.push(milestone);
      });
    }

    // Note: cellData has been removed - references (comments, files, links) are now handled via plan_references table
    // with plan_reference_type to specify if they are at plan, period, or day level

    // Validate plan before saving
    try {
      plan.validate();
      console.log("[PlanService.update] Plan validation passed");
    } catch (validationError) {
      console.error(
        "[PlanService.update] Plan validation failed:",
        validationError
      );
      throw new Error(
        `Plan validation failed: ${
          validationError instanceof Error
            ? validationError.message
            : String(validationError)
        }`
      );
    }

    try {
      this.logger.log("[PlanService.update] About to save plan:", {
        id: plan.id,
        name: plan.name,
        componentsCount: plan.components?.length || 0,
        components:
          plan.components?.map((c: any) => ({
            componentId: c.componentId,
            currentVersion: c.currentVersion,
            finalVersion: c.finalVersion,
          })) || [],
      });

      // Save plan - TypeORM should automatically serialize the JSONB field
      // For JSONB columns, TypeORM should detect changes automatically, but we'll ensure it's saved
      const updated = await this.repository.save(plan);

      // Defensive: Validate update result
      if (!updated) {
        throw new Error("Failed to update plan");
      }

      // Reload plan to verify components were saved correctly (TypeORM might cache the entity)
      const reloadedPlan = await this.repository.findById(updated.id);

      // Verify components and phases with metricValues were saved correctly
      this.logger.log("[PlanService.update] Plan saved successfully:", {
        id: updated.id,
        name: updated.name,
        componentsCountBeforeReload: updated.components?.length || 0,
        componentsAfterReload: reloadedPlan?.components?.length || 0,
        components:
          reloadedPlan?.components?.map((c: any) => ({
            componentId: c.componentId,
            currentVersion: c.currentVersion,
            finalVersion: c.finalVersion,
          })) || [],
        phasesCount: reloadedPlan?.phases?.length || 0,
        phases:
          reloadedPlan?.phases?.map((p: any) => ({
            id: p.id,
            name: p.name,
            hasMetricValues: !!p.metricValues,
            metricValues: p.metricValues,
            metricValuesType: typeof p.metricValues,
            keys: p.metricValues ? Object.keys(p.metricValues) : [],
          })) || [],
      });

      // Use reloaded plan to ensure we have the latest data from database
      return new PlanResponseDto(reloadedPlan || updated);
    } catch (saveError: any) {
      console.error("[PlanService.update] Error saving plan:", {
        error: saveError,
        errorMessage: saveError?.message,
        errorStack: saveError?.stack,
        errorName: saveError?.name,
        errorCode: saveError?.code,
      });
      console.error("[PlanService.update] Plan state:", {
        id: plan.id,
        name: plan.name,
        owner: plan.owner,
        startDate: plan.startDate,
        endDate: plan.endDate,
        status: plan.status,
        productId: plan.productId,
        itOwner: plan.itOwner,
        componentsCount: plan.components?.length || 0,
        components: plan.components?.map((c: any) => ({
          componentId: c.componentId,
          finalVersion: c.finalVersion,
        })),
        phasesCount: plan.phases?.length || 0,
        tasksCount: plan.tasks?.length || 0,
      });

      // If it's a validation error from PlanComponentVersion or other validation, wrap it
      if (
        saveError?.message?.includes("required") ||
        saveError?.message?.includes("is required")
      ) {
        throw new BadRequestException(saveError.message || "Validation error");
      }

      // Re-throw BadRequestException as-is
      if (saveError instanceof BadRequestException) {
        throw saveError;
      }

      // For other errors, wrap in a more descriptive error
      throw new Error(
        `Error saving plan: ${saveError?.message || String(saveError)}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, "Plan");

    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException("Plan", id);
    }
    await this.repository.delete(id);
  }

  /**
   * Transactional method to update plan and features status atomically
   * This ensures that both operations succeed or fail together (ACID)
   * Uses optimistic locking for both plan and features
   */
  async updatePlanWithFeaturesTransactionally(
    planId: string,
    planDto: UpdatePlanDto,
    featureUpdates: Array<{
      id: string;
      status: FeatureStatus;
      updatedAt: string;
    }>
  ): Promise<PlanResponseDto> {
    // Defensive: Validate inputs
    validateId(planId, "Plan");
    validateObject(planDto, "UpdatePlanDto");
    if (featureUpdates && !Array.isArray(featureUpdates)) {
      throw new Error("Feature updates must be an array");
    }

    // Use transaction to ensure atomicity
    // Access the EntityManager through the repository's manager property
    const planRepo = this.repository as any;
    if (!planRepo.repository || !planRepo.repository.manager) {
      throw new Error("Repository manager not available for transactions");
    }

    return await planRepo.repository.manager.transaction(
      async (transactionalEntityManager) => {
        // Step 1: Load plan with optimistic locking check
        const plan = await transactionalEntityManager.findOne(Plan, {
          where: { id: planId } as any,
        });

        if (!plan) {
          throw new NotFoundException("Plan", planId);
        }

        // Optimistic locking: Check if plan was modified since client last fetched it
        if (planDto.updatedAt) {
          const clientUpdatedAt = new Date(planDto.updatedAt);
          const serverUpdatedAt = new Date(plan.updatedAt);

          const timeDiff = Math.abs(
            serverUpdatedAt.getTime() - clientUpdatedAt.getTime()
          );
          if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
            throw new ConflictException(
              "Plan was modified by another user. Please refresh and try again.",
              "CONCURRENT_MODIFICATION"
            );
          }
        }

        // Step 2: Update plan fields (simplified - full update logic would go here)
        if (planDto.name) {
          plan.name = planDto.name.trim().replace(/\s+/g, " ");
        }
        if (planDto.description !== undefined) {
          plan.description = planDto.description;
        }
        if (planDto.status) {
          plan.status = planDto.status;
        }
        if (planDto.startDate) {
          plan.startDate = new Date(planDto.startDate);
        }
        if (planDto.endDate) {
          plan.endDate = new Date(planDto.endDate);
        }
        if (planDto.featureIds) {
          plan.featureIds = planDto.featureIds;
        }

        // Step 3: Update features status with optimistic locking
        if (featureUpdates && featureUpdates.length > 0) {
          for (const featureUpdate of featureUpdates) {
            const feature = await transactionalEntityManager.findOne(Feature, {
              where: { id: featureUpdate.id } as any,
            });

            if (!feature) {
              throw new NotFoundException("Feature", featureUpdate.id);
            }

            // Optimistic locking: Check if feature was modified since client last fetched it
            const clientUpdatedAt = new Date(featureUpdate.updatedAt);
            const serverUpdatedAt = new Date(feature.updatedAt);

            const timeDiff = Math.abs(
              serverUpdatedAt.getTime() - clientUpdatedAt.getTime()
            );
            if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
              throw new ConflictException(
                `Feature ${featureUpdate.id} was modified by another user. Please refresh and try again.`,
                "CONCURRENT_MODIFICATION"
              );
            }

            // Update feature status
            feature.status = featureUpdate.status;
            await transactionalEntityManager.save(Feature, feature);
          }
        }

        // Step 4: Save plan (all changes are committed atomically)
        const savedPlan = await transactionalEntityManager.save(Plan, plan);

        if (!savedPlan) {
          throw new Error("Failed to save plan");
        }

        return new PlanResponseDto(savedPlan);
      }
    );
  }

  /**
   * Transactional method to update plan and component versions atomically
   * This ensures that both operations succeed or fail together (ACID)
   * Uses optimistic locking for both plan and product/components
   * Updates component versions: previousVersion = currentVersion, currentVersion = finalVersion
   */
  async updatePlanWithComponentsTransactionally(
    planId: string,
    planDto: UpdatePlanDto,
    componentUpdates: Array<{
      id: string;
      finalVersion: string;
      updatedAt: string;
    }>,
    productId: string,
    productUpdatedAt: string
  ): Promise<PlanResponseDto> {
    // Defensive: Validate inputs
    validateId(planId, "Plan");
    validateObject(planDto, "UpdatePlanDto");
    validateId(productId, "Product");
    if (componentUpdates && !Array.isArray(componentUpdates)) {
      throw new Error("Component updates must be an array");
    }

    // Use transaction to ensure atomicity
    const planRepo = this.repository as any;
    if (!planRepo.repository || !planRepo.repository.manager) {
      throw new Error("Repository manager not available for transactions");
    }

    return await planRepo.repository.manager.transaction(
      async (transactionalEntityManager) => {
        // Step 1: Load plan with optimistic locking check
        const plan = await transactionalEntityManager.findOne(Plan, {
          where: { id: planId } as any,
        });

        if (!plan) {
          throw new NotFoundException("Plan", planId);
        }

        // Optimistic locking: Check if plan was modified since client last fetched it
        if (planDto.updatedAt) {
          const clientUpdatedAt = new Date(planDto.updatedAt);
          const serverUpdatedAt = new Date(plan.updatedAt);

          const timeDiff = Math.abs(
            serverUpdatedAt.getTime() - clientUpdatedAt.getTime()
          );
          if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
            throw new ConflictException(
              "Plan was modified by another user. Please refresh and try again.",
              "CONCURRENT_MODIFICATION"
            );
          }
        }

        // Step 2: Load product with optimistic locking check
        const product = await transactionalEntityManager.findOne(Product, {
          where: { id: productId } as any,
          relations: ["components", "components.componentType"],
        });

        if (!product) {
          throw new NotFoundException("Product", productId);
        }

        // Optimistic locking: Check if product was modified since client last fetched it
        const clientProductUpdatedAt = new Date(productUpdatedAt);
        const serverProductUpdatedAt = new Date(product.updatedAt);

        const productTimeDiff = Math.abs(
          serverProductUpdatedAt.getTime() - clientProductUpdatedAt.getTime()
        );
        if (
          productTimeDiff > 1000 &&
          serverProductUpdatedAt > clientProductUpdatedAt
        ) {
          throw new ConflictException(
            "Product was modified by another user. Please refresh and try again.",
            "CONCURRENT_MODIFICATION"
          );
        }

        // Step 3: Store previous components for version history comparison
        const previousComponents = plan.components || [];
        const previousComponentsMap = new Map(
          previousComponents.map((c) => [c.componentId, c.finalVersion])
        );

        // Step 4: Update plan components
        if (planDto.components) {
          plan.components = planDto.components;
        }

        // Step 5: Update component versions atomically and create version history
        if (componentUpdates && componentUpdates.length > 0) {
          for (const componentUpdate of componentUpdates) {
            const component = product.components.find(
              (c) => c.id === componentUpdate.id
            );

            if (!component) {
              throw new NotFoundException("Component", componentUpdate.id);
            }

            // Optimistic locking: Check if component was modified since client last fetched it
            const clientComponentUpdatedAt = new Date(
              componentUpdate.updatedAt
            );
            const serverComponentUpdatedAt = new Date(component.updatedAt);

            const componentTimeDiff = Math.abs(
              serverComponentUpdatedAt.getTime() -
                clientComponentUpdatedAt.getTime()
            );
            if (
              componentTimeDiff > 1000 &&
              serverComponentUpdatedAt > clientComponentUpdatedAt
            ) {
              throw new ConflictException(
                `Component ${componentUpdate.id} was modified by another user. Please refresh and try again.`,
                "CONCURRENT_MODIFICATION"
              );
            }

            // Get previous version from plan components or use currentVersion from product
            const previousVersion =
              previousComponentsMap.get(componentUpdate.id) ||
              component.currentVersion;

            // Only create history record if version changed
            if (previousVersion !== componentUpdate.finalVersion) {
              const versionHistory = new PlanComponentVersion(
                plan.id,
                product.id,
                componentUpdate.id,
                previousVersion, // oldVersion: previous finalVersion or currentVersion
                componentUpdate.finalVersion // newVersion: new finalVersion
              );

              await transactionalEntityManager.save(
                PlanComponentVersion,
                versionHistory
              );
            }

            // Update component versions: previousVersion = currentVersion, currentVersion = finalVersion
            component.previousVersion = component.currentVersion; // currentVersion becomes previousVersion
            component.currentVersion = componentUpdate.finalVersion; // finalVersion becomes new currentVersion

            await transactionalEntityManager.save(
              ProductComponentVersion,
              component
            );
          }
        }

        // Step 6: Also create history records for components that are new (not in componentUpdates but in planDto.components)
        if (planDto.components) {
          const componentUpdateIds = new Set(
            componentUpdates?.map((c) => c.id) || []
          );

          for (const planComp of planDto.components) {
            // Skip if already processed in componentUpdates
            if (componentUpdateIds.has(planComp.componentId)) {
              continue;
            }

            // This is a new component being added to the plan
            const component = product.components.find(
              (c) => c.id === planComp.componentId
            );

            if (component) {
              // Get previous version (should be empty or currentVersion from product)
              const previousVersion =
                previousComponentsMap.get(planComp.componentId) ||
                component.currentVersion;

              // Create history record for new component assignment
              const versionHistory = new PlanComponentVersion(
                plan.id,
                product.id,
                planComp.componentId,
                previousVersion, // oldVersion: currentVersion from product
                planComp.finalVersion // newVersion: finalVersion assigned to plan
              );

              await transactionalEntityManager.save(
                PlanComponentVersion,
                versionHistory
              );
            }
          }
        }

        // Step 7: Save plan and product (all changes are committed atomically)
        const savedPlan = await transactionalEntityManager.save(Plan, plan);
        const savedProduct = await transactionalEntityManager.save(
          Product,
          product
        );

        if (!savedPlan) {
          throw new Error("Failed to save plan");
        }
        if (!savedProduct) {
          throw new Error("Failed to save product");
        }

        return new PlanResponseDto(savedPlan);
      }
    );
  }

  /**
   * Get all reschedules for a specific plan phase
   */
  async getPhaseReschedules(planPhaseId: string): Promise<any[]> {
    validateId(planPhaseId, "Plan Phase");

    console.log(
      `[PlanService.getPhaseReschedules] Fetching reschedules for phase: ${planPhaseId}`
    );
    this.logger.log(
      `[PlanService.getPhaseReschedules] Fetching reschedules for phase: ${planPhaseId}`
    );

    const planRepo = this.repository as any;
    const manager = planRepo.repository?.manager || planRepo.manager;

    if (!manager) {
      throw new Error("Database manager not available");
    }

    // Load phase separately to get its name, avoiding the planPhase relation error
    const phase = await manager.findOne(PlanPhase, {
      where: { id: planPhaseId } as any,
    });

    // Load reschedules using QueryBuilder to explicitly use table name and avoid relation inference
    const reschedules = await manager
      .createQueryBuilder(PhaseReschedule, "reschedule")
      .where("reschedule.planPhaseId = :planPhaseId", { planPhaseId })
      .orderBy("reschedule.rescheduledAt", "DESC")
      .getMany();

    console.log(
      `[PlanService.getPhaseReschedules] Found ${reschedules.length} reschedules for phase ${planPhaseId}`
    );
    this.logger.log(
      `[PlanService.getPhaseReschedules] Found ${reschedules.length} reschedules for phase ${planPhaseId}`
    );

    // Load reschedule types and owners separately if needed
    const rescheduleTypeIds = [
      ...new Set(reschedules.map((r) => r.rescheduleTypeId).filter(Boolean)),
    ];
    const ownerIds = [
      ...new Set(reschedules.map((r) => r.ownerId).filter(Boolean)),
    ];

    const RescheduleType =
      require("../../reschedule-types/domain/reschedule-type.entity").RescheduleType;
    const Owner = require("../../owners/domain/owner.entity").Owner;

    const rescheduleTypesMap = new Map<string, any>();
    const ownersMap = new Map<string, any>();

    if (rescheduleTypeIds.length > 0) {
      const rescheduleTypes = await manager.find(RescheduleType, {
        where: { id: In(rescheduleTypeIds) } as any,
      });
      rescheduleTypes.forEach((rt) => {
        if (rt.id) rescheduleTypesMap.set(rt.id, rt);
      });
    }

    if (ownerIds.length > 0) {
      const owners = await manager.find(Owner, {
        where: { id: In(ownerIds) } as any,
      });
      owners.forEach((o) => {
        if (o.id) ownersMap.set(o.id, o);
      });
    }

    if (reschedules.length > 0) {
      const rescheduleType = reschedules[0].rescheduleTypeId
        ? rescheduleTypesMap.get(reschedules[0].rescheduleTypeId)
        : null;
      const owner = reschedules[0].ownerId
        ? ownersMap.get(reschedules[0].ownerId)
        : null;

      console.log(`[PlanService.getPhaseReschedules] Sample reschedule:`, {
        id: reschedules[0].id,
        planPhaseId: reschedules[0].planPhaseId,
        phaseName: phase?.name || "Unknown",
        rescheduledAt: reschedules[0].rescheduledAt,
        originalStartDate: reschedules[0].originalStartDate,
        originalEndDate: reschedules[0].originalEndDate,
        newStartDate: reschedules[0].newStartDate,
        newEndDate: reschedules[0].newEndDate,
        rescheduleTypeName: rescheduleType?.name,
        ownerName: owner?.name,
      });
    }

    return reschedules.map((r: PhaseReschedule) => {
      const rescheduleType = r.rescheduleTypeId
        ? rescheduleTypesMap.get(r.rescheduleTypeId)
        : null;
      const owner = r.ownerId ? ownersMap.get(r.ownerId) : null;

      return {
        id: r.id,
        planPhaseId: r.planPhaseId,
        phaseName: phase?.name || "Unknown",
        rescheduledAt: r.rescheduledAt,
        originalStartDate: r.originalStartDate,
        originalEndDate: r.originalEndDate,
        newStartDate: r.newStartDate,
        newEndDate: r.newEndDate,
        rescheduleTypeId: r.rescheduleTypeId,
        rescheduleTypeName: rescheduleType?.name || null,
        ownerId: r.ownerId,
        ownerName: owner?.name || null,
      };
    });
  }

  /**
   * Get all reschedules for a plan (all phases)
   */
  async getPlanReschedules(planId: string): Promise<any[]> {
    validateId(planId, "Plan");

    console.log(
      `[PlanService.getPlanReschedules] Fetching reschedules for plan: ${planId}`
    );
    this.logger.log(
      `[PlanService.getPlanReschedules] Fetching reschedules for plan: ${planId}`
    );

    // ⚡ CRITICAL: Load plan with phases relation to get phase IDs
    const planRepo = this.repository as any;
    const manager = planRepo.repository?.manager || planRepo.manager;

    if (!manager) {
      throw new Error("Database manager not available");
    }

    // Load plan with phases relation
    const plan = await manager.findOne(Plan, {
      where: { id: planId } as any,
      relations: ["phases"],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    console.log(
      `[PlanService.getPlanReschedules] Plan found: ${
        plan.name
      }, phases count: ${plan.phases?.length || 0}`
    );
    this.logger.log(
      `[PlanService.getPlanReschedules] Plan found: ${
        plan.name
      }, phases count: ${plan.phases?.length || 0}`
    );

    // Get all phase IDs for this plan and create a map for quick lookup
    const phaseIds = plan.phases?.map((p) => p.id) || [];
    const phasesMap = new Map<string, any>();
    plan.phases?.forEach((p) => {
      if (p.id) {
        phasesMap.set(p.id, p);
      }
    });

    console.log(`[PlanService.getPlanReschedules] Phase IDs:`, phaseIds);
    this.logger.log(
      `[PlanService.getPlanReschedules] Phase IDs: ${JSON.stringify(phaseIds)}`
    );

    if (phaseIds.length === 0) {
      console.log(
        `[PlanService.getPlanReschedules] No phases found for plan ${planId}, returning empty array`
      );
      this.logger.log(
        `[PlanService.getPlanReschedules] No phases found for plan ${planId}, returning empty array`
      );
      return [];
    }

    // Load reschedules using QueryBuilder to explicitly use table name and avoid relation inference
    // We'll load rescheduleType and owner separately if needed
    const reschedules = await manager
      .createQueryBuilder(PhaseReschedule, "reschedule")
      .where("reschedule.planPhaseId IN (:...phaseIds)", { phaseIds })
      .orderBy("reschedule.rescheduledAt", "DESC")
      .getMany();

    console.log(
      `[PlanService.getPlanReschedules] Found ${reschedules.length} reschedules for plan ${planId}`
    );
    this.logger.log(
      `[PlanService.getPlanReschedules] Found ${reschedules.length} reschedules for plan ${planId}`
    );

    if (reschedules.length > 0) {
      const phase = phasesMap.get(reschedules[0].planPhaseId);
      console.log(`[PlanService.getPlanReschedules] Sample reschedule:`, {
        id: reschedules[0].id,
        planPhaseId: reschedules[0].planPhaseId,
        phaseName: phase?.name || "Unknown",
        rescheduledAt: reschedules[0].rescheduledAt,
      });
    }

    // Load reschedule types and owners separately if needed
    const rescheduleTypeIds = [
      ...new Set(reschedules.map((r) => r.rescheduleTypeId).filter(Boolean)),
    ];
    const ownerIds = [
      ...new Set(reschedules.map((r) => r.ownerId).filter(Boolean)),
    ];

    const RescheduleType =
      require("../../reschedule-types/domain/reschedule-type.entity").RescheduleType;
    const Owner = require("../../owners/domain/owner.entity").Owner;

    const rescheduleTypesMap = new Map<string, any>();
    const ownersMap = new Map<string, any>();

    if (rescheduleTypeIds.length > 0) {
      const rescheduleTypes = await manager.find(RescheduleType, {
        where: { id: In(rescheduleTypeIds) } as any,
      });
      rescheduleTypes.forEach((rt) => {
        if (rt.id) rescheduleTypesMap.set(rt.id, rt);
      });
    }

    if (ownerIds.length > 0) {
      const owners = await manager.find(Owner, {
        where: { id: In(ownerIds) } as any,
      });
      owners.forEach((o) => {
        if (o.id) ownersMap.set(o.id, o);
      });
    }

    return reschedules.map((r: PhaseReschedule) => {
      const phase = phasesMap.get(r.planPhaseId);
      const rescheduleType = r.rescheduleTypeId
        ? rescheduleTypesMap.get(r.rescheduleTypeId)
        : null;
      const owner = r.ownerId ? ownersMap.get(r.ownerId) : null;

      return {
        id: r.id,
        planPhaseId: r.planPhaseId,
        phaseName: phase?.name || "Unknown",
        rescheduledAt: r.rescheduledAt,
        originalStartDate: r.originalStartDate,
        originalEndDate: r.originalEndDate,
        newStartDate: r.newStartDate,
        newEndDate: r.newEndDate,
        rescheduleTypeId: r.rescheduleTypeId,
        rescheduleTypeName: rescheduleType?.name || null,
        ownerId: r.ownerId,
        ownerName: owner?.name || null,
      };
    });
  }

  /**
   * Update a phase reschedule (only ownerId and rescheduleTypeId can be updated)
   */
  async updateReschedule(
    rescheduleId: string,
    dto: { rescheduleTypeId?: string; ownerId?: string }
  ): Promise<any> {
    validateId(rescheduleId, "Reschedule");

    // Get manager from repository (same pattern as other methods)
    const planRepo = this.repository as any;
    const manager = planRepo.repository?.manager || planRepo.manager;

    if (!manager) {
      throw new Error("Database manager not available");
    }

    // Find the reschedule
    const reschedule = await manager.findOne(PhaseReschedule, {
      where: { id: rescheduleId } as any,
    });

    if (!reschedule) {
      throw new Error(`Reschedule with ID ${rescheduleId} not found`);
    }

    // Validate rescheduleTypeId if provided
    if (dto.rescheduleTypeId) {
      validateId(dto.rescheduleTypeId, "Reschedule Type");
      const rescheduleType = await manager.findOne(
        require("../../reschedule-types/domain/reschedule-type.entity")
          .RescheduleType,
        {
          where: { id: dto.rescheduleTypeId } as any,
        }
      );
      if (!rescheduleType) {
        throw new Error(
          `Reschedule type with ID ${dto.rescheduleTypeId} not found`
        );
      }
    }

    // Validate ownerId if provided
    if (dto.ownerId) {
      validateId(dto.ownerId, "Owner");
      const owner = await manager.findOne(
        require("../../owners/domain/owner.entity").Owner,
        {
          where: { id: dto.ownerId } as any,
        }
      );
      if (!owner) {
        throw new Error(`Owner with ID ${dto.ownerId} not found`);
      }
    }

    // Update only allowed fields
    if (dto.rescheduleTypeId !== undefined) {
      reschedule.rescheduleTypeId = dto.rescheduleTypeId;
    }
    if (dto.ownerId !== undefined) {
      reschedule.ownerId = dto.ownerId;
    }

    // Save the updated reschedule
    await manager.save(PhaseReschedule, reschedule);

    // Reload with relations to get updated names
    const updatedReschedule = await manager
      .createQueryBuilder(PhaseReschedule, "reschedule")
      .leftJoinAndSelect("reschedule.rescheduleType", "rescheduleType")
      .leftJoinAndSelect("reschedule.owner", "owner")
      .where("reschedule.id = :id", { id: rescheduleId })
      .getOne();

    if (!updatedReschedule) {
      throw new Error(`Failed to reload reschedule ${rescheduleId}`);
    }

    // Get phase name
    const phase = await manager.findOne(
      require("../domain/plan-phase.entity").PlanPhase,
      {
        where: { id: updatedReschedule.planPhaseId } as any,
      }
    );

    return {
      id: updatedReschedule.id,
      planPhaseId: updatedReschedule.planPhaseId,
      phaseName: phase?.name || "Unknown",
      rescheduledAt: updatedReschedule.rescheduledAt,
      originalStartDate: updatedReschedule.originalStartDate,
      originalEndDate: updatedReschedule.originalEndDate,
      newStartDate: updatedReschedule.newStartDate,
      newEndDate: updatedReschedule.newEndDate,
      rescheduleTypeId: updatedReschedule.rescheduleTypeId,
      rescheduleTypeName:
        (updatedReschedule.rescheduleType as any)?.name || null,
      ownerId: updatedReschedule.ownerId,
      ownerName: (updatedReschedule.owner as any)?.name || null,
    };
  }

  /**
   * Get or create the default "Default" reschedule type within a transaction
   * This ensures atomicity when creating reschedules
   * Always ensures "Default" type exists before creating phase reschedules
   */
  private async getOrCreateDefaultRescheduleType(
    transactionalManager: any
  ): Promise<RescheduleType> {
    const DEFAULT_NAME = "Default";

    this.logger.log(
      `[PlanService.getOrCreateDefaultRescheduleType] Looking for type: "${DEFAULT_NAME}"`
    );

    // Try to find existing "Default" reschedule type within transaction
    let defaultType = await transactionalManager.findOne(RescheduleType, {
      where: { name: DEFAULT_NAME } as any,
    });

    if (!defaultType) {
      // Create "Default" reschedule type if it doesn't exist (atomic within transaction)
      this.logger.log(
        `[PlanService.getOrCreateDefaultRescheduleType] Creating default reschedule type "${DEFAULT_NAME}" within transaction`
      );
      try {
        defaultType = new RescheduleType(
          DEFAULT_NAME,
          "Default reschedule type for automatic phase date changes"
        );
        this.logger.log(
          `[PlanService.getOrCreateDefaultRescheduleType] RescheduleType object created, saving...`
        );
        defaultType = await transactionalManager.save(
          RescheduleType,
          defaultType
        );
        this.logger.log(
          `[PlanService.getOrCreateDefaultRescheduleType] ✅ Default reschedule type created with ID: ${defaultType.id}`
        );
      } catch (error: any) {
        this.logger.error(
          `[PlanService.getOrCreateDefaultRescheduleType] ❌ Error creating default type: ${error?.message}`,
          error?.stack
        );
        throw error;
      }
    } else {
      this.logger.log(
        `[PlanService.getOrCreateDefaultRescheduleType] ✅ Using existing default reschedule type "${DEFAULT_NAME}" with ID: ${defaultType.id}`
      );
    }

    // Ensure we have a valid ID
    if (!defaultType || !defaultType.id) {
      this.logger.error(
        `[PlanService.getOrCreateDefaultRescheduleType] ❌ Invalid default type: ${JSON.stringify(
          defaultType
        )}`
      );
      throw new Error("Failed to get or create default reschedule type");
    }

    return defaultType;
  }
}
