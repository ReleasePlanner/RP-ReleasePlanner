import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { Team, TeamType } from '../domain/team.entity';
import { TeamTalentAssignment } from '../domain/team-talent-assignment.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import type { ITeamRepository } from '../infrastructure/team.repository';
import type { ITalentRepository } from '../infrastructure/talent.repository';
import {
  ConflictException,
  NotFoundException,
} from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    @Inject('ITeamRepository')
    private readonly repository: ITeamRepository,
    @Inject('ITalentRepository')
    private readonly talentRepository: ITalentRepository,
  ) {}

  async findAll(): Promise<TeamResponseDto[]> {
    const teams = await this.repository.findAll();
    if (!teams) {
      return [];
    }
    return teams.map((team) => new TeamResponseDto(team));
  }

  async findById(id: string): Promise<TeamResponseDto> {
    validateId(id, 'Team');
    const team = await this.repository.findById(id);
    if (!team) {
      throw new NotFoundException('Team', id);
    }
    return new TeamResponseDto(team);
  }

  /**
   * Validates that the total allocation percentage for a talent doesn't exceed 100%
   */
  private async validateTalentAllocations(
    assignments: Array<{ talentId: string; allocationPercentage: number }>,
    excludeTeamId?: string,
  ): Promise<void> {
    // Group assignments by talentId
    const talentAllocations = new Map<string, number>();
    for (const assignment of assignments) {
      const current = talentAllocations.get(assignment.talentId) || 0;
      talentAllocations.set(
        assignment.talentId,
        current + assignment.allocationPercentage,
      );
    }

    // Check each talent's total allocation
    for (const [talentId, newTotal] of talentAllocations.entries()) {
      const existingTotal = await this.talentRepository.getTotalAllocationPercentage(
        talentId,
        excludeTeamId,
      );
      const total = existingTotal + newTotal;

      if (total > 100) {
        const talent = await this.talentRepository.findById(talentId);
        const talentName = talent?.name || talentId;
        throw new BadRequestException(
          `Total allocation for talent "${talentName}" would exceed 100%. ` +
            `Current: ${existingTotal.toFixed(2)}%, New: ${newTotal.toFixed(2)}%, Total: ${total.toFixed(2)}%`,
        );
      }
    }
  }

  async create(dto: CreateTeamDto): Promise<TeamResponseDto> {
    validateObject(dto, 'CreateTeamDto');
    validateString(dto.name, 'Team name');

    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Team with name "${dto.name}" already exists`,
        'DUPLICATE_TEAM_NAME',
      );
    }

    const team = new Team(
      dto.name,
      dto.description,
      dto.type || TeamType.INTERNAL,
    );

    // Validate talent allocations if provided
    if (dto.talentAssignments && dto.talentAssignments.length > 0) {
      await this.validateTalentAllocations(
        dto.talentAssignments.map((a) => ({
          talentId: a.talentId,
          allocationPercentage: a.allocationPercentage,
        })),
      );

      // Create assignment entities
      team.talentAssignments = dto.talentAssignments.map(
        (assignmentDto) =>
          new TeamTalentAssignment(
            undefined, // teamId will be set after team is saved
            assignmentDto.talentId,
            assignmentDto.allocationPercentage,
          ),
      );
    }

    // Save team - TypeORM cascade will save assignments automatically
    const created = await this.repository.create(team);
    
    // Reload with assignments to ensure they're included in the response
    const teamWithAssignments = await this.repository.findByIdWithAssignments(created.id);
    return new TeamResponseDto(teamWithAssignments || created);
  }

  async update(id: string, dto: UpdateTeamDto): Promise<TeamResponseDto> {
    validateId(id, 'Team');
    validateObject(dto, 'UpdateTeamDto');

    const team = await this.repository.findById(id);
    if (!team) {
      throw new NotFoundException('Team', id);
    }

    if (dto.updatedAt) {
      const clientUpdatedAt = new Date(dto.updatedAt);
      const serverUpdatedAt = new Date(team.updatedAt);
      const timeDiff = Math.abs(serverUpdatedAt.getTime() - clientUpdatedAt.getTime());
      if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
        throw new ConflictException(
          'Team was modified by another user. Please refresh and try again.',
          'OPTIMISTIC_LOCK_ERROR',
        );
      }
    }

    if (dto.name && dto.name !== team.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Team with name "${dto.name}" already exists`,
          'DUPLICATE_TEAM_NAME',
        );
      }
    }

    // Update team properties
    if (dto.name !== undefined) team.name = dto.name;
    if (dto.description !== undefined) team.description = dto.description;
    if (dto.type !== undefined) team.type = dto.type;

    // Update talent assignments if provided
    if (dto.talentAssignments !== undefined) {
      // Validate allocations before updating
      await this.validateTalentAllocations(
        dto.talentAssignments.map((a) => ({
          talentId: a.talentId,
          allocationPercentage: a.allocationPercentage,
        })),
        id, // Exclude current team's assignments from existing total
      );

      // Create new assignment entities
      team.talentAssignments = dto.talentAssignments.map(
        (assignmentDto) =>
          new TeamTalentAssignment(
            team.id,
            assignmentDto.talentId,
            assignmentDto.allocationPercentage,
          ),
      );
    }

    team.touch(); // Update the updatedAt timestamp
    const updated = await this.repository.update(id, team);
    // Reload with assignments to ensure they're included in the response
    const teamWithAssignments = await this.repository.findByIdWithAssignments(updated.id);
    return new TeamResponseDto(teamWithAssignments || updated);
  }

  async delete(id: string): Promise<void> {
    validateId(id, 'Team');
    const team = await this.repository.findById(id);
    if (!team) {
      throw new NotFoundException('Team', id);
    }
    await this.repository.delete(id);
  }
}
