import { Injectable, Inject } from "@nestjs/common";
import { Role } from "../domain/role.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleResponseDto } from "./dto/role-response.dto";
import type { IRoleRepository } from "../infrastructure/role.repository";
import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/business-exception";
import { validateId, validateObject, validateString } from "@rp-release-planner/rp-shared";

@Injectable()
export class RoleService {
  constructor(
    @Inject("IRoleRepository")
    private readonly repository: IRoleRepository
  ) {}

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.repository.findAll();
    if (!roles) {
      return [];
    }
    return roles.map((role) => new RoleResponseDto(role));
  }

  async findById(id: string): Promise<RoleResponseDto> {
    validateId(id, "Role");
    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundException("Role", id);
    }
    return new RoleResponseDto(role);
  }

  async create(dto: CreateRoleDto): Promise<RoleResponseDto> {
    validateObject(dto, "CreateRoleDto");
    validateString(dto.name, "Role name");

    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Role with name "${dto.name}" already exists`,
        "DUPLICATE_ROLE_NAME"
      );
    }

    const role = new Role(dto.name);
    const created = await this.repository.create(role);
    return new RoleResponseDto(created);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto> {
    validateId(id, "Role");
    validateObject(dto, "UpdateRoleDto");

    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundException("Role", id);
    }

    if (dto.updatedAt) {
      const clientUpdatedAt = new Date(dto.updatedAt);
      const serverUpdatedAt = new Date(role.updatedAt);
      const timeDiff = Math.abs(
        serverUpdatedAt.getTime() - clientUpdatedAt.getTime()
      );
      if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
        throw new ConflictException(
          "Role was modified by another user. Please refresh and try again.",
          "OPTIMISTIC_LOCK_ERROR"
        );
      }
    }

    if (dto.name && dto.name !== role.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Role with name "${dto.name}" already exists`,
          "DUPLICATE_ROLE_NAME"
        );
      }
    }

    if (dto.name !== undefined) role.name = dto.name;

    role.touch();
    const updated = await this.repository.update(id, role);
    return new RoleResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    validateId(id, "Role");
    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundException("Role", id);
    }
    await this.repository.delete(id);
  }
}

