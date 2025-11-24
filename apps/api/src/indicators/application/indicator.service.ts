/**
 * Indicator Service
 */
import { Injectable, Inject } from '@nestjs/common';
import { Indicator, IndicatorStatus } from '../domain/indicator.entity';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { IndicatorResponseDto } from './dto/indicator-response.dto';
import type { IIndicatorRepository } from '../infrastructure/indicator.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class IndicatorService {
  constructor(
    @Inject('IIndicatorRepository')
    private readonly repository: IIndicatorRepository,
  ) {}

  async findAll(): Promise<IndicatorResponseDto[]> {
    const indicators = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!indicators) {
      return [];
    }
    return indicators.map((indicator) => {
      if (!indicator) return null;
      return new IndicatorResponseDto(indicator);
    }).filter(Boolean) as IndicatorResponseDto[];
  }

  async findById(id: string): Promise<IndicatorResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Indicator');
    
    const indicator = await this.repository.findById(id);
    if (!indicator) {
      throw new NotFoundException('Indicator', id);
    }
    return new IndicatorResponseDto(indicator);
  }

  async create(dto: CreateIndicatorDto): Promise<IndicatorResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreateIndicatorDto');
    validateString(dto.name, 'Indicator name');

    // Check name uniqueness
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Indicator with name "${dto.name}" already exists`,
        'DUPLICATE_INDICATOR_NAME',
      );
    }

    // Create indicator
    const indicator = new Indicator(
      dto.name,
      dto.description,
      dto.formula,
      dto.status || IndicatorStatus.ACTIVE,
    );
    
    const created = await this.repository.create(indicator);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create indicator');
    }
    
    return new IndicatorResponseDto(created);
  }

  async update(id: string, dto: UpdateIndicatorDto): Promise<IndicatorResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Indicator');
    validateObject(dto, 'UpdateIndicatorDto');

    const indicator = await this.repository.findById(id);
    if (!indicator) {
      throw new NotFoundException('Indicator', id);
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== indicator.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing) {
        throw new ConflictException(
          `Indicator with name "${dto.name}" already exists`,
          'DUPLICATE_INDICATOR_NAME',
        );
      }
    }

    // Update fields
    if (dto.name !== undefined) {
      indicator.name = dto.name;
    }
    if (dto.description !== undefined) {
      indicator.description = dto.description;
    }
    if (dto.formula !== undefined) {
      indicator.formula = dto.formula;
    }
    if (dto.status !== undefined) {
      indicator.status = dto.status;
    }

    // Validate updated entity
    indicator.validate();

    // Save changes
    const updated = await this.repository.update(indicator);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update indicator');
    }
    
    return new IndicatorResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Indicator');

    const indicator = await this.repository.findById(id);
    if (!indicator) {
      throw new NotFoundException('Indicator', id);
    }

    await this.repository.delete(id);
  }
}

