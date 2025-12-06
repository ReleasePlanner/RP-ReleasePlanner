/**
 * Plan RCA Service
 * 
 * Application layer - Business logic
 */
import { Injectable, Inject } from '@nestjs/common';
import { PlanRca } from '../domain/plan-rca.entity';
import { CreatePlanRcaDto } from './dto/create-plan-rca.dto';
import { UpdatePlanRcaDto } from './dto/update-plan-rca.dto';
import { PlanRcaResponseDto } from './dto/plan-rca-response.dto';
import type { IPlanRcaRepository } from '../infrastructure/plan-rca.repository';
import type { IPlanRepository } from '../infrastructure/plan.repository';
import { NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject } from '@rp-release-planner/rp-shared';

@Injectable()
export class PlanRcaService {
  constructor(
    @Inject('IPlanRcaRepository')
    private readonly repository: IPlanRcaRepository,
    @Inject('IPlanRepository')
    private readonly planRepository: IPlanRepository,
  ) {}

  /**
   * Get all RCAs for a plan
   */
  async findByPlanId(planId: string): Promise<PlanRcaResponseDto[]> {
    validateId(planId, 'Plan');

    // Verify plan exists
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new NotFoundException('Plan', planId);
    }

    const rcas = await this.repository.findByPlanId(planId);
    if (!rcas) {
      return [];
    }
    return rcas
      .filter((rca) => rca !== null && rca !== undefined)
      .map((rca) => new PlanRcaResponseDto(rca));
  }

  /**
   * Get RCA by ID
   */
  async findById(id: string): Promise<PlanRcaResponseDto> {
    validateId(id, 'Plan RCA');
    
    const rca = await this.repository.findById(id);
    if (!rca) {
      throw new NotFoundException('Plan RCA', id);
    }
    return new PlanRcaResponseDto(rca);
  }

  /**
   * Create a new RCA for a plan
   */
  async create(planId: string, dto: CreatePlanRcaDto): Promise<PlanRcaResponseDto> {
    validateId(planId, 'Plan');
    validateObject(dto, 'CreatePlanRcaDto');

    // Verify plan exists
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new NotFoundException('Plan', planId);
    }

    const rca = new PlanRca(
      dto.supportTicketNumber,
      dto.rcaNumber,
      dto.keyIssuesTags || [],
      dto.learningsTags || [],
      dto.technicalDescription,
      dto.referenceFileUrl,
    );
    rca.planId = planId;
    rca.validate();

    const saved = await this.repository.create(rca);
    return new PlanRcaResponseDto(saved);
  }

  /**
   * Update a RCA
   */
  async update(id: string, dto: UpdatePlanRcaDto): Promise<PlanRcaResponseDto> {
    validateId(id, 'Plan RCA');
    validateObject(dto, 'UpdatePlanRcaDto');

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException('Plan RCA', id);
    }

    // Update fields
    if (dto.supportTicketNumber !== undefined) {
      existing.supportTicketNumber = dto.supportTicketNumber;
    }
    if (dto.rcaNumber !== undefined) {
      existing.rcaNumber = dto.rcaNumber;
    }
    if (dto.keyIssuesTags !== undefined) {
      existing.keyIssuesTags = dto.keyIssuesTags;
    }
    if (dto.learningsTags !== undefined) {
      existing.learningsTags = dto.learningsTags;
    }
    if (dto.technicalDescription !== undefined) {
      existing.technicalDescription = dto.technicalDescription;
    }
    if (dto.referenceFileUrl !== undefined) {
      existing.referenceFileUrl = dto.referenceFileUrl;
    }

    existing.validate();
    const updated = await this.repository.update(id, existing);
    return new PlanRcaResponseDto(updated);
  }

  /**
   * Delete a RCA
   */
  async delete(id: string): Promise<void> {
    validateId(id, 'Plan RCA');

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException('Plan RCA', id);
    }

    await this.repository.delete(id);
  }
}

