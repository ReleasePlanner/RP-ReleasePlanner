import { Injectable, Inject } from "@nestjs/common";
import { Talent } from "../domain/talent.entity";
import { CreateTalentDto } from "./dto/create-talent.dto";
import { UpdateTalentDto } from "./dto/update-talent.dto";
import { TalentResponseDto } from "./dto/talent-response.dto";
import type { ITalentRepository } from "../infrastructure/talent.repository";
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
export class TalentService {
  constructor(
    @Inject("ITalentRepository")
    private readonly repository: ITalentRepository
  ) {}

  async findAll(): Promise<TalentResponseDto[]> {
    const talents = await this.repository.findAll();
    return talents.map((talent) => this.mapToResponseDto(talent));
  }

  async findById(id: string): Promise<TalentResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateId as any)(id, "Talent");
    const talent: Talent | null = await this.repository.findById(id);
    if (!talent) {
      throw new NotFoundException("Talent", id);
    }
    return this.mapToResponseDto(talent);
  }

  async create(dto: CreateTalentDto): Promise<TalentResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateObject as any)(dto, "CreateTalentDto");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateString as any)(dto.name, "Talent name");

    // Check if talent with same email already exists
    if (dto.email) {
      const allTalents = await this.repository.findAll();
      const existing = allTalents.find((t) => t.email === dto.email);
      if (existing) {
        throw new ConflictException(
          `Talent with email "${dto.email}" already exists`,
          "DUPLICATE_TALENT_EMAIL"
        );
      }
    }

    const talent = new Talent(dto.name, dto.email, dto.phone, dto.roleId);

    const created = await this.repository.create(talent);
    return this.mapToResponseDto(created);
  }

  async update(id: string, dto: UpdateTalentDto): Promise<TalentResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateId as any)(id, "Talent");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateObject as any)(dto, "UpdateTalentDto");

    const talent: Talent | null = await this.repository.findById(id);
    if (!talent) {
      throw new NotFoundException("Talent", id);
    }

    // Check optimistic locking
    if (dto.updatedAt) {
      const clientUpdatedAt = new Date(dto.updatedAt);
      const serverUpdatedAt = new Date(talent.updatedAt);
      const timeDiff = Math.abs(
        serverUpdatedAt.getTime() - clientUpdatedAt.getTime()
      );
      if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
        throw new ConflictException(
          "Talent was modified by another user. Please refresh and try again.",
          "OPTIMISTIC_LOCK_ERROR"
        );
      }
    }

    // Check if email is being changed and if it already exists
    if (dto.email && dto.email !== talent.email) {
      const allTalents = await this.repository.findAll();
      const existing = allTalents.find((t) => t.email === dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Talent with email "${dto.email}" already exists`,
          "DUPLICATE_TALENT_EMAIL"
        );
      }
    }

    // Update talent properties
    if (dto.name !== undefined) talent.name = dto.name;
    if (dto.email !== undefined) talent.email = dto.email;
    if (dto.phone !== undefined) talent.phone = dto.phone;
    if (dto.roleId !== undefined) talent.roleId = dto.roleId;

    talent.touch(); // Update the updatedAt timestamp
    const updated = await this.repository.update(id, talent);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateId as any)(id, "Talent");
    const talent: Talent | null = await this.repository.findById(id);
    if (!talent) {
      throw new NotFoundException("Talent", id);
    }
    await this.repository.delete(id);
  }

  async getTotalAllocationPercentage(
    talentId: string,
    excludeTeamId?: string,
  ): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateId as any)(talentId, "Talent");
    return this.repository.getTotalAllocationPercentage(talentId, excludeTeamId);
  }

  private mapToResponseDto(talent: Talent): TalentResponseDto {
    return {
      id: talent.id,
      name: talent.name,
      email: talent.email,
      phone: talent.phone,
      roleId: talent.roleId,
      role: talent.role
        ? {
            id: talent.role.id,
            name: talent.role.name,
          }
        : undefined,
      createdAt: talent.createdAt,
      updatedAt: talent.updatedAt,
    };
  }
}
