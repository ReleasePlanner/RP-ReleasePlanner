/**
 * Plan Repository
 *
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { BaseRepository } from "../../common/database/base.repository";
import { Plan } from "../domain/plan.entity";
import { PhaseReschedule } from "../domain/phase-reschedule.entity";
import { PlanRca } from "../domain/plan-rca.entity";
import { Feature, FeatureStatus } from "../../features/domain/feature.entity";
import { IRepository } from "../../common/interfaces/repository.interface";
import { validateId } from "@rp-release-planner/rp-shared";
import { NotFoundException } from "../../common/exceptions/business-exception";
import { Owner } from "../../owners/domain/owner.entity";

export interface IPlanRepository extends IRepository<Plan> {
  findByProductId(productId: string): Promise<Plan[]>;
  findByStatus(status: string): Promise<Plan[]>;
  findByName(name: string): Promise<Plan | null>;
  findWithRelations(id: string): Promise<Plan | null>;
  findAllWithOwnerName(): Promise<Array<Plan & { ownerName?: string }>>;
}

@Injectable()
export class PlanRepository
  extends BaseRepository<Plan>
  implements IPlanRepository
{
  constructor(
    @InjectRepository(Plan)
    repository: Repository<Plan>
  ) {
    super(repository);
  }

  async findByProductId(productId: string): Promise<Plan[]> {
    return this.repository.find({
      where: { productId } as any,
    });
  }

  async findByStatus(status: string): Promise<Plan[]> {
    return this.repository.find({
      where: { status: status as any } as any,
    });
  }

  // Removed: findByOwner - owner field is being removed from plans table
  // Use itOwner field instead and join with it_owners table

  async findByName(name: string): Promise<Plan | null> {
    // Normalize name: trim whitespace and normalize multiple spaces
    const normalizedName = name.trim().replace(/\s+/g, " ");
    if (!normalizedName) {
      return null;
    }

    console.log(`[PlanRepository.findByName] Searching for:`, {
      original: name,
      normalized: normalizedName,
      normalizedLower: normalizedName.toLowerCase(),
    });

    // Fetch all plans and compare normalized names
    // This ensures we catch duplicates regardless of:
    // - Case differences (MB vs mb)
    // - Multiple spaces (MB  Independent vs MB Independent)
    // - Leading/trailing spaces
    const allPlans = await this.repository.find();

    console.log(
      `[PlanRepository.findByName] Total plans in DB:`,
      allPlans.length
    );

    const found = allPlans.find((plan) => {
      const planNameNormalized = plan.name.trim().replace(/\s+/g, " ");
      const matches =
        planNameNormalized.toLowerCase() === normalizedName.toLowerCase();

      // Log only if match found
      if (matches) {
        console.log(`[PlanRepository.findByName] Match found:`, {
          planId: plan.id,
          planName: plan.name,
          planNameNormalized: planNameNormalized,
          planNameLower: planNameNormalized.toLowerCase(),
          searchedNormalized: normalizedName,
          searchedLower: normalizedName.toLowerCase(),
        });
      }

      return matches;
    });

    if (found) {
      console.log(`[PlanRepository.findByName] DUPLICATE FOUND:`, {
        searched: normalizedName,
        foundId: found.id,
        foundName: found.name,
        foundNormalized: found.name.trim().replace(/\s+/g, " ").toLowerCase(),
      });
    } else {
      console.log(
        `[PlanRepository.findByName] No duplicate found for:`,
        normalizedName
      );
    }

    return found || null;
  }

  async findWithRelations(id: string): Promise<Plan | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: [
        "phases",
        "tasks",
        "milestones",
        "references",
        "references.planReferenceType",
        "references.calendarDay",
      ],
    });
  }

  override async findById(id: string): Promise<Plan | null> {
    return this.findWithRelations(id);
  }

  /**
   * Find all plans with IT Owner name loaded via JOIN
   * Returns plans with ownerName property populated from it_owners table
   */
  async findAllWithOwnerName(): Promise<Array<Plan & { ownerName?: string }>> {
    return this.handleDatabaseOperation(async () => {
      // Use raw SQL query to bypass TypeORM query builder issues with table name resolution
      // This ensures PostgreSQL correctly identifies the it_owners table
      const rawQuery = `
          SELECT 
            plan.id,
            plan.name,
            plan."startDate",
            plan."endDate",
            plan.status,
            plan.description,
            plan."productId",
            plan."itOwner",
            plan."featureIds",
            plan.components,
            plan."calendarIds",
            plan."indicatorIds",
            plan."createdAt",
            plan."updatedAt",
            owners.name as "ownerName"
          FROM plans plan
          LEFT JOIN owners ON owners.id::text = plan."itOwner"
          ORDER BY plan."createdAt" DESC
        `;

      const rawResults = await this.repository.query(rawQuery);

      if (!rawResults || rawResults.length === 0) {
        return [];
      }

      // Extract plan IDs from raw results
      const planIds = rawResults.map((raw: any) => raw.id);

      // Fetch Plan entities for the returned IDs WITH relations to load references, phases, milestones, etc.
      const plans = await this.repository.find({
        where: { id: In(planIds) } as any,
        relations: [
          "phases",
          "tasks",
          "milestones",
          "references", // IMPORTANT: Load references from plan_references table
          "references.planReferenceType",
          "references.calendarDay",
        ],
      });

      const plansMap = new Map(plans.map((plan) => [plan.id, plan]));
      const ownerNameMap = new Map(
        rawResults.map((raw: any) => [raw.id, raw.ownerName || null])
      );

      // Map results maintaining order from raw query and adding ownerName
      return planIds
        .map((id: string) => {
          const plan = plansMap.get(id);
          if (plan) {
            (plan as any).ownerName = ownerNameMap.get(id) || null;
            return plan;
          }
          return null;
        })
        .filter((plan: Plan | null): plan is Plan => plan !== null);
    }, "findAllWithOwnerName");
  }

  override async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, "Plan");

    return this.handleDatabaseOperation(async () => {
      // Use transaction to ensure all related data is deleted atomically
      await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          // First, load the plan with all relations to ensure cascade works correctly
          const plan = await transactionalEntityManager.findOne(Plan, {
            where: { id } as any,
            relations: [
              "phases",
              "tasks",
              "milestones",
              "references",
              "references.planReferenceType",
              "references.calendarDay",
              "componentVersions",
              "rcas",
            ],
          });

          if (!plan) {
            throw new NotFoundException("Plan", id);
          }

          // IMPORTANT: Before deleting the plan, update associated features to "completed"
          // This ensures features are properly marked as completed when their plan is deleted
          if (plan.featureIds && plan.featureIds.length > 0) {
            const featureIds = plan.featureIds.filter((id) => id && id.trim().length > 0);
            if (featureIds.length > 0) {
              // Update all associated features to "completed" status
              await transactionalEntityManager.update(
                Feature,
                { id: In(featureIds) },
                { status: FeatureStatus.COMPLETED }
              );
            }
          }

          // IMPORTANT: Delete order matters to respect foreign key constraints
          // Delete in this order to ensure atomic deletion:

          // 1. Delete phase reschedules (plan_phase_reschedules) - depends on plan_phases
          //    Note: Database CASCADE DELETE will handle this automatically when phases are deleted,
          //    but we delete explicitly first to ensure atomicity and clear error messages
          if (plan.phases && plan.phases.length > 0) {
            const phaseIds = plan.phases.map((phase) => phase.id);
            if (phaseIds.length > 0) {
              await transactionalEntityManager.delete(PhaseReschedule, {
                planPhaseId: In(phaseIds),
              });
            }
          }

          // 2. Delete plan phases (plan_phases) - CASCADE will delete reschedules
          //    Already handled by TypeORM cascade, but explicit for clarity
          //    Note: PhaseReschedule entities are deleted above, but TypeORM cascade will ensure
          //    any remaining ones are also deleted when phases are removed

          // 3. Delete plan tasks (plan_tasks) - CASCADE DELETE
          //    Already handled by TypeORM cascade

          // 4. Delete plan milestones (plan_milestones) - CASCADE DELETE
          //    Already handled by TypeORM cascade

          // 5. Delete plan references (plan_references) - CASCADE DELETE
          //    Note: plan_references has FK to plan_reference_types (master table) with SET NULL
          //    and FK to calendar_days (master table) with CASCADE - this is correct
          //    Already handled by TypeORM cascade

          // 6. Delete plan component versions (plan_component_versions) - CASCADE DELETE
          //    Note: This table references products and components (master tables) but only stores IDs
          //    No FK constraints to master tables, so safe to delete
          //    Already handled by TypeORM cascade

          // 7. Delete plan RCAs (plan_rcas) - CASCADE DELETE
          //    Already handled by TypeORM cascade

          // 8. Delete GanttCellData (gantt_cell_data) if it exists - legacy/deprecated table
          //    Note: This table has been deprecated in favor of plan_references, but if it exists
          //    in the database, it should be deleted. The table has FK to plans with CASCADE DELETE,
          //    but we delete explicitly to ensure atomicity
          try {
            const GanttCellData = require("../domain/gantt-cell-data.entity").GanttCellData;
            await transactionalEntityManager.delete(GanttCellData, {
              planId: id,
            });
          } catch (error) {
            // GanttCellData might not exist or be available - this is OK, continue with deletion
            // The database CASCADE DELETE will handle it if the table exists
            console.warn(
              `[PlanRepository.delete] Could not delete GanttCellData for plan ${id}:`,
              error instanceof Error ? error.message : String(error)
            );
          }

          // 9. Finally, delete the plan itself
          //    This will trigger CASCADE DELETE for all related entities defined with cascade: true
          //    All child entities should already be deleted above, but TypeORM cascade ensures
          //    nothing is missed even if relations weren't loaded
          await transactionalEntityManager.remove(Plan, plan);

          // IMPORTANT: The following master tables are NOT deleted (as expected):
          // - phases (base phases maintenance)
          // - owners (it_owners table)
          // - products
          // - features
          // - calendars
          // - indicators
          // - teams
          // - reschedule_types
          // - plan_reference_types
          // These are master data tables and should never be deleted when a plan is deleted
        }
      );
    }, `delete(${id})`);
  }
}
