import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Team } from '../domain/team.entity';
import { TeamTalentAssignment } from '../domain/team-talent-assignment.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { validateString } from '@rp-release-planner/rp-shared';

export interface ITeamRepository extends IRepository<Team> {
  findByName(name: string): Promise<Team | null>;
  findByIdWithAssignments(id: string): Promise<Team | null>;
}

@Injectable()
export class TeamRepository
  extends BaseRepository<Team>
  implements ITeamRepository
{
  constructor(
    @InjectRepository(Team)
    repository: Repository<Team>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Team | null> {
    validateString(name, 'Team name');
    return this.handleDatabaseOperation(
      () => this.repository.findOne({ where: { name } as any }),
      `findByName(${name})`,
    );
  }

  async findByIdWithAssignments(id: string): Promise<Team | null> {
    return this.handleDatabaseOperation(
      () =>
        this.repository.findOne({
          where: { id } as any,
          relations: ['talentAssignments', 'talentAssignments.talent', 'talentAssignments.talent.role'],
        }),
      `findByIdWithAssignments(${id})`,
    );
  }

  override async findAll(): Promise<Team[]> {
    return this.handleDatabaseOperation(
      () =>
        this.repository.find({
          relations: ['talentAssignments', 'talentAssignments.talent', 'talentAssignments.talent.role'],
          order: { createdAt: 'DESC' },
        }),
      'findAll',
    );
  }

  override async findById(id: string): Promise<Team | null> {
    return this.findByIdWithAssignments(id);
  }

  override async create(entityData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    return this.handleDatabaseOperation(
      async () => {
        // Create entity instance
        const entity = this.repository.create(entityData as Team);
        if (!entity) {
          throw new Error('Failed to create team entity');
        }
        // Save team first to get the ID
        const saved = await this.repository.save(entity);
        if (!saved) {
          throw new Error('Failed to save team');
        }
        // Set teamId for all assignments and save them
        if (saved.talentAssignments && saved.talentAssignments.length > 0) {
          for (const assignment of saved.talentAssignments) {
            assignment.teamId = saved.id;
          }
          await this.repository.manager.save(saved.talentAssignments);
        }
        return saved;
      },
      'create',
    );
  }

  override async update(id: string, updates: Partial<Team>): Promise<Team> {
    return this.handleDatabaseOperation(
      async () => {
        // Use explicit transaction to ensure atomicity when updating talent assignments
        return await this.repository.manager.transaction(async (transactionalEntityManager) => {
          // Load existing team with talent assignments
          const entity = await transactionalEntityManager.findOne(Team, {
            where: { id } as any,
            relations: ['talentAssignments', 'talentAssignments.talent', 'talentAssignments.talent.role'],
          });
          
          if (!entity) {
            throw new Error(`Team with id ${id} not found`);
          }

          // Update team properties (excluding talentAssignments which are handled separately)
          const { talentAssignments, ...otherUpdates } = updates;
          Object.assign(entity, otherUpdates);
          
          // If talent assignments are being updated, handle cascade properly
          if (talentAssignments !== undefined) {
            // Delete existing assignments first (transactional)
            if (entity.talentAssignments && entity.talentAssignments.length > 0) {
              await transactionalEntityManager.remove(TeamTalentAssignment, entity.talentAssignments);
            }
            
            // Ensure all assignments have valid talentIds before assigning
            const validAssignments = talentAssignments
              .filter(
                (assignment) =>
                  assignment &&
                  assignment.talentId &&
                  assignment.talentId.trim() !== '' &&
                  assignment.talentId !== null &&
                  assignment.talentId !== undefined,
              )
              .map(
                (assignmentDto) =>
                  new TeamTalentAssignment(
                    entity.id,
                    assignmentDto.talentId,
                    assignmentDto.allocationPercentage,
                  ),
              );
            
            // Assign new assignments to entity (will be saved with cascade when team is saved)
            entity.talentAssignments = validAssignments;
          }
          
          // Save team (transactional)
          const saved = await transactionalEntityManager.save(Team, entity);
          if (!saved) {
            throw new Error('Failed to save updated team');
          }
          
          // Reload with all relations to ensure consistency
          const reloaded = await transactionalEntityManager.findOne(Team, {
            where: { id: saved.id } as any,
            relations: ['talentAssignments', 'talentAssignments.talent', 'talentAssignments.talent.role'],
          });
          
          return reloaded || saved;
        });
      },
      `update(${id})`,
    );
  }
}

