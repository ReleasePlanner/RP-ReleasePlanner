import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Team, TeamType } from '../domain/team.entity';
import { TeamTalentAssignment } from '../domain/team-talent-assignment.entity';
import { Talent } from '../domain/talent.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { AddTalentToTeamDto } from './dto/add-talent-to-team.dto';
import { AddMultipleTalentsToTeamDto } from './dto/add-multiple-talents-to-team.dto';
import { CreateTalentAndAssignDto } from './dto/create-talent-and-assign.dto';
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
    @InjectDataSource()
    private readonly dataSource: DataSource,
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
      // Check for duplicate talent IDs in the request
      const talentIds = new Set<string>();
      for (const assignment of dto.talentAssignments) {
        if (talentIds.has(assignment.talentId)) {
          throw new BadRequestException(
            `Duplicate talent ID "${assignment.talentId}" in the request. Each talent can only be assigned once to a team.`,
          );
        }
        talentIds.add(assignment.talentId);
      }

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
      // Filter out any assignments with invalid talentIds
      const validAssignments = dto.talentAssignments.filter(
        (assignment) =>
          assignment.talentId &&
          assignment.talentId.trim() !== '' &&
          assignment.talentId !== null &&
          assignment.talentId !== undefined,
      );

      if (validAssignments.length > 0) {
        // Check for duplicate talent IDs in the request
        const talentIds = new Set<string>();
        for (const assignment of validAssignments) {
          if (talentIds.has(assignment.talentId)) {
            throw new BadRequestException(
              `Duplicate talent ID "${assignment.talentId}" in the request. Each talent can only be assigned once to a team.`,
            );
          }
          talentIds.add(assignment.talentId);
        }

        // Validate allocations before updating
        await this.validateTalentAllocations(
          validAssignments.map((a) => ({
            talentId: a.talentId,
            allocationPercentage: a.allocationPercentage,
          })),
          id, // Exclude current team's assignments from existing total
        );

        // Create new assignment entities
        team.talentAssignments = validAssignments.map(
          (assignmentDto) =>
            new TeamTalentAssignment(
              team.id,
              assignmentDto.talentId,
              assignmentDto.allocationPercentage,
            ),
        );
      } else {
        // If all assignments were invalid or empty array, clear assignments
        team.talentAssignments = [];
      }
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

  /**
   * Add an existing talent to a team
   * Atomic operation using database transaction
   */
  async addTalentToTeam(
    teamId: string,
    dto: AddTalentToTeamDto,
  ): Promise<TeamResponseDto> {
    validateId(teamId, 'Team');
    validateId(dto.talentId, 'Talent');

    return await this.dataSource.transaction(async (manager) => {
      // Verify team exists
      const team = await manager.findOne(Team, { where: { id: teamId } as any });
      if (!team) {
        throw new NotFoundException('Team', teamId);
      }

      // Verify talent exists
      const talent = await manager.findOne(Talent, {
        where: { id: dto.talentId } as any,
      });
      if (!talent) {
        throw new NotFoundException('Talent', dto.talentId);
      }

      // Check if assignment already exists
      const existingAssignment = await manager.findOne(TeamTalentAssignment, {
        where: {
          teamId,
          talentId: dto.talentId,
        } as any,
      });

      if (existingAssignment) {
        throw new ConflictException(
          `Talent "${talent.name}" is already assigned to this team`,
          'DUPLICATE_ASSIGNMENT',
        );
      }

      // Validate allocation percentage
      const existingTotal = await this.talentRepository.getTotalAllocationPercentage(
        dto.talentId,
        teamId,
      );
      const total = existingTotal + dto.allocationPercentage;

      if (total > 100) {
        throw new BadRequestException(
          `Total allocation for talent "${talent.name}" would exceed 100%. ` +
            `Current: ${existingTotal.toFixed(2)}%, New: ${dto.allocationPercentage.toFixed(2)}%, Total: ${total.toFixed(2)}%`,
        );
      }

      // Create assignment
      const assignment = new TeamTalentAssignment(
        teamId,
        dto.talentId,
        dto.allocationPercentage,
      );
      await manager.save(TeamTalentAssignment, assignment);

      // Reload team with assignments
      const updatedTeam = await this.repository.findByIdWithAssignments(teamId);
      if (!updatedTeam) {
        throw new NotFoundException('Team', teamId);
      }

      return new TeamResponseDto(updatedTeam);
    });
  }

  /**
   * Add multiple existing talents to a team
   * Atomic operation using database transaction
   */
  async addMultipleTalentsToTeam(
    teamId: string,
    dto: AddMultipleTalentsToTeamDto,
  ): Promise<TeamResponseDto> {
    validateId(teamId, 'Team');
    if (!dto.talents || dto.talents.length === 0) {
      throw new BadRequestException('At least one talent is required');
    }

    return await this.dataSource.transaction(async (manager) => {
      // Verify team exists
      const team = await manager.findOne(Team, { where: { id: teamId } as any });
      if (!team) {
        throw new NotFoundException('Team', teamId);
      }

      // Validate all talents exist and check for duplicates
      const talentIds = new Set<string>();
      const talentMap = new Map<string, Talent>();

      for (const talentDto of dto.talents) {
        validateId(talentDto.talentId, 'Talent');

        // Check for duplicate talent IDs in the request
        if (talentIds.has(talentDto.talentId)) {
          throw new BadRequestException(
            `Duplicate talent ID "${talentDto.talentId}" in the request`,
          );
        }
        talentIds.add(talentDto.talentId);

        // Verify talent exists
        const talent = await manager.findOne(Talent, {
          where: { id: talentDto.talentId } as any,
        });
        if (!talent) {
          throw new NotFoundException('Talent', talentDto.talentId);
        }
        talentMap.set(talentDto.talentId, talent);

        // Check if assignment already exists
        const existingAssignment = await manager.findOne(TeamTalentAssignment, {
          where: {
            teamId,
            talentId: talentDto.talentId,
          } as any,
        });

        if (existingAssignment) {
          throw new ConflictException(
            `Talent "${talent.name}" is already assigned to this team`,
            'DUPLICATE_ASSIGNMENT',
          );
        }
      }

      // Validate allocation percentages for all talents
      for (const talentDto of dto.talents) {
        const existingTotal = await this.talentRepository.getTotalAllocationPercentage(
          talentDto.talentId,
          teamId,
        );
        const total = existingTotal + talentDto.allocationPercentage;

        if (total > 100) {
          const talent = talentMap.get(talentDto.talentId);
          const talentName = talent?.name || talentDto.talentId;
          throw new BadRequestException(
            `Total allocation for talent "${talentName}" would exceed 100%. ` +
              `Current: ${existingTotal.toFixed(2)}%, New: ${talentDto.allocationPercentage.toFixed(2)}%, Total: ${total.toFixed(2)}%`,
          );
        }
      }

      // Create all assignments
      const assignments = dto.talents.map(
        (talentDto) =>
          new TeamTalentAssignment(
            teamId,
            talentDto.talentId,
            talentDto.allocationPercentage,
          ),
      );
      await manager.save(TeamTalentAssignment, assignments);

      // Reload team with assignments
      const updatedTeam = await this.repository.findByIdWithAssignments(teamId);
      if (!updatedTeam) {
        throw new NotFoundException('Team', teamId);
      }

      return new TeamResponseDto(updatedTeam);
    });
  }

  /**
   * Create a new talent and assign it to a team
   * Atomic operation using database transaction
   */
  async createTalentAndAssign(
    teamId: string,
    dto: CreateTalentAndAssignDto,
  ): Promise<TeamResponseDto> {
    validateId(teamId, 'Team');
    validateObject(dto, 'CreateTalentAndAssignDto');
    validateString(dto.name, 'Talent name');

    return await this.dataSource.transaction(async (manager) => {
      // Verify team exists
      const team = await manager.findOne(Team, { where: { id: teamId } as any });
      if (!team) {
        throw new NotFoundException('Team', teamId);
      }

      // Check if talent with same email already exists
      if (dto.email) {
        const existingTalent = await manager.findOne(Talent, {
          where: { email: dto.email } as any,
        });
        if (existingTalent) {
          throw new ConflictException(
            `Talent with email "${dto.email}" already exists`,
            'DUPLICATE_TALENT_EMAIL',
          );
        }
      }

      // Create talent
      const talent = new Talent(dto.name, dto.email, dto.phone, dto.roleId);
      const createdTalent = await manager.save(Talent, talent);

      // Validate allocation percentage
      const existingTotal = await this.talentRepository.getTotalAllocationPercentage(
        createdTalent.id,
        teamId,
      );
      const total = existingTotal + dto.allocationPercentage;

      if (total > 100) {
        throw new BadRequestException(
          `Total allocation for talent "${talent.name}" would exceed 100%. ` +
            `Current: ${existingTotal.toFixed(2)}%, New: ${dto.allocationPercentage.toFixed(2)}%, Total: ${total.toFixed(2)}%`,
        );
      }

      // Create assignment
      const assignment = new TeamTalentAssignment(
        teamId,
        createdTalent.id,
        dto.allocationPercentage,
      );
      await manager.save(TeamTalentAssignment, assignment);

      // Reload team with assignments
      const updatedTeam = await this.repository.findByIdWithAssignments(teamId);
      if (!updatedTeam) {
        throw new NotFoundException('Team', teamId);
      }

      return new TeamResponseDto(updatedTeam);
    });
  }
}
