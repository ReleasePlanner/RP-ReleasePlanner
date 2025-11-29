/**
 * Reschedule Type Service
 * 
 * Application layer - Business logic
 */
import { Injectable, Inject } from '@nestjs/common';
import { RescheduleType } from '../domain/reschedule-type.entity';
import { CreateRescheduleTypeDto } from './dto/create-reschedule-type.dto';
import { UpdateRescheduleTypeDto } from './dto/update-reschedule-type.dto';
import { RescheduleTypeResponseDto } from './dto/reschedule-type-response.dto';
import type { IRescheduleTypeRepository } from '../infrastructure/reschedule-type.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class RescheduleTypeService {
  constructor(
    @Inject('IRescheduleTypeRepository')
    private readonly repository: IRescheduleTypeRepository,
  ) {}

  /**
   * Get all reschedule types
   */
  async findAll(): Promise<RescheduleTypeResponseDto[]> {
    const types = await this.repository.findAll();
    if (!types) {
      return [];
    }
    return types
      .filter((type) => type !== null && type !== undefined)
      .map((type) => new RescheduleTypeResponseDto(type));
  }

  /**
   * Get reschedule type by ID
   */
  async findById(id: string): Promise<RescheduleTypeResponseDto> {
    validateId(id, 'Reschedule Type');
    
    const type = await this.repository.findById(id);
    if (!type) {
      throw new NotFoundException('Reschedule Type', id);
    }
    return new RescheduleTypeResponseDto(type);
  }

  /**
   * Create a new reschedule type
   */
  async create(dto: CreateRescheduleTypeDto): Promise<RescheduleTypeResponseDto> {
    validateObject(dto, 'CreateRescheduleTypeDto');
    validateString(dto.name, 'Reschedule type name');

    // Check if name already exists
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Reschedule Type', 'name', dto.name);
    }

    const type = new RescheduleType(dto.name, dto.description);
    const saved = await this.repository.create(type);
    return new RescheduleTypeResponseDto(saved);
  }

  /**
   * Update a reschedule type
   */
  async update(id: string, dto: UpdateRescheduleTypeDto): Promise<RescheduleTypeResponseDto> {
    validateId(id, 'Reschedule Type');
    validateObject(dto, 'UpdateRescheduleTypeDto');

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException('Reschedule Type', id);
    }

    // Check if new name conflicts with existing type
    if (dto.name && dto.name !== existing.name) {
      const nameConflict = await this.repository.findByName(dto.name);
      if (nameConflict) {
        throw new ConflictException('Reschedule Type', 'name', dto.name);
      }
    }

    // Update fields
    if (dto.name !== undefined) {
      existing.name = dto.name;
    }
    if (dto.description !== undefined) {
      existing.description = dto.description;
    }

    existing.validate();
    const updated = await this.repository.update(id, existing);
    return new RescheduleTypeResponseDto(updated);
  }

  /**
   * Delete a reschedule type
   */
  async delete(id: string): Promise<void> {
    validateId(id, 'Reschedule Type');

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException('Reschedule Type', id);
    }

    await this.repository.delete(id);
  }
}

