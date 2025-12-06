/**
 * Base Phase Service
 *
 * Application layer - Business logic
 */
import { Injectable, Inject } from "@nestjs/common";
import { Phase } from "../domain/base-phase.entity";
import { CreateBasePhaseDto } from "./dto/create-base-phase.dto";
import { UpdateBasePhaseDto } from "./dto/update-base-phase.dto";
import { BasePhaseResponseDto } from "./dto/base-phase-response.dto";
import type { IBasePhaseRepository } from "../infrastructure/base-phase.repository";
import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/business-exception";
import {
  validateId,
  validateObject,
  validateString,
} from "@rp-release-planner/rp-shared";

@Injectable()
export class BasePhaseService {
  constructor(
    @Inject("IBasePhaseRepository")
    private readonly repository: IBasePhaseRepository
  ) {}

  /**
   * Get all base phases, ordered by sequence
   */
  async findAll(): Promise<BasePhaseResponseDto[]> {
    const phases = await this.repository.findAllOrderedBySequence();
    // Defensive: Handle null/undefined results
    if (!phases) {
      return [];
    }
    return phases
      .filter((phase) => phase !== null && phase !== undefined)
      .map((phase) => new BasePhaseResponseDto(phase));
  }

  /**
   * Get base phase by ID
   */
  async findById(id: string): Promise<BasePhaseResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, "Base Phase");

    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new NotFoundException("Base Phase", id);
    }
    return new BasePhaseResponseDto(phase);
  }

  /**
   * Create a new base phase
   * Business rules:
   * - Name must be unique
   * - Color must be unique
   */
  async create(dto: CreateBasePhaseDto): Promise<BasePhaseResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, "CreateBasePhaseDto");
    validateString(dto.name, "Phase name");
    validateString(dto.color, "Phase color");

    // Check name uniqueness
    const existingByName = await this.repository.findByName(dto.name);
    if (existingByName) {
      throw new ConflictException(
        `Base phase with name "${dto.name}" already exists`,
        "DUPLICATE_PHASE_NAME"
      );
    }

    // Check color uniqueness
    const existingByColor = await this.repository.findByColor(dto.color);
    if (existingByColor) {
      throw new ConflictException(
        `Base phase with color "${dto.color}" already exists`,
        "DUPLICATE_PHASE_COLOR"
      );
    }

    // Determine sequence: use provided sequence or assign next available
    let sequence = dto.sequence;
    if (sequence === undefined) {
      const maxSequence = await this.repository.getMaxSequence();
      sequence = maxSequence + 1;
    }

    // Create entity
    const phase = new Phase(dto.name, dto.color, dto.isDefault, sequence);
    phase.validate(); // Validate before creating

    const created = await this.repository.create(phase);

    // Defensive: Validate creation result
    if (!created) {
      throw new Error("Failed to create base phase");
    }

    return new BasePhaseResponseDto(created);
  }

  /**
   * Update base phase
   * Business rules:
   * - Name must be unique (if changed)
   * - Color must be unique (if changed)
   */
  async update(
    id: string,
    dto: UpdateBasePhaseDto
  ): Promise<BasePhaseResponseDto> {
    // Defensive: Validate inputs
    validateId(id, "Base Phase");
    validateObject(dto, "UpdateBasePhaseDto");

    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new NotFoundException("Base Phase", id);
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== phase.name) {
      validateString(dto.name, "Phase name");
      const existingByName = await this.repository.findByName(dto.name);
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException(
          `Base phase with name "${dto.name}" already exists`,
          "DUPLICATE_PHASE_NAME"
        );
      }
    }

    // Check color uniqueness if color is being updated
    if (dto.color && dto.color !== phase.color) {
      validateString(dto.color, "Phase color");
      const existingByColor = await this.repository.findByColor(dto.color);
      if (existingByColor && existingByColor.id !== id) {
        throw new ConflictException(
          `Base phase with color "${dto.color}" already exists`,
          "DUPLICATE_PHASE_COLOR"
        );
      }
    }

    // Update entity
    const updated = await this.repository.update(id, dto);

    // Defensive: Validate update result
    if (!updated) {
      throw new Error("Failed to update base phase");
    }

    updated.validate();

    return new BasePhaseResponseDto(updated);
  }

  /**
   * Delete base phase
   */
  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, "Base Phase");

    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException("Base Phase", id);
    }
    await this.repository.delete(id);
  }

  /**
   * Reorder phases by updating their sequence values
   * @param phaseIds Array of phase IDs in the desired order
   */
  async reorderPhases(phaseIds: string[]): Promise<BasePhaseResponseDto[]> {
    // Defensive: Validate input
    if (!Array.isArray(phaseIds) || phaseIds.length === 0) {
      throw new Error("Phase IDs array is required and must not be empty");
    }

    // Validate all IDs exist
    const phases = await Promise.all(
      phaseIds.map((id) => {
        validateId(id, "Phase ID");
        return this.repository.findById(id);
      })
    );

    const notFoundIds = phases
      .map((phase, index) => (phase ? null : phaseIds[index]))
      .filter((id) => id !== null) as string[];

    if (notFoundIds.length > 0) {
      throw new NotFoundException(
        `Phases not found: ${notFoundIds.join(", ")}`,
        notFoundIds[0]
      );
    }

    // Update sequence for each phase (1, 2, 3, ...)
    const updatePromises = phaseIds.map((id, index) =>
      this.repository.update(id, { sequence: index + 1 })
    );

    await Promise.all(updatePromises);

    // Return updated phases ordered by new sequence
    const updatedPhases = await this.repository.findAllOrderedBySequence();
    return updatedPhases.map((phase) => new BasePhaseResponseDto(phase));
  }
}
