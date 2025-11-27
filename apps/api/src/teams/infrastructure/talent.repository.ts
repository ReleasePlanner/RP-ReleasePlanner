import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Talent } from '../domain/talent.entity';
import { TeamTalentAssignment } from '../domain/team-talent-assignment.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface ITalentRepository extends IRepository<Talent> {
  findByIdWithAssignments(id: string): Promise<Talent | null>;
  getTotalAllocationPercentage(talentId: string, excludeTeamId?: string): Promise<number>;
}

@Injectable()
export class TalentRepository
  extends BaseRepository<Talent>
  implements ITalentRepository
{
  private assignmentRepository: Repository<TeamTalentAssignment>;

  constructor(
    @InjectRepository(Talent)
    repository: Repository<Talent>,
    private dataSource: DataSource,
  ) {
    super(repository);
    this.assignmentRepository = this.dataSource.getRepository(TeamTalentAssignment);
  }

  async findByIdWithAssignments(id: string): Promise<Talent | null> {
    return this.handleDatabaseOperation(
      () =>
        this.repository.findOne({
          where: { id } as any,
          relations: ['teamAssignments', 'teamAssignments.team', 'role'],
        }),
      `findByIdWithAssignments(${id})`,
    );
  }

  async getTotalAllocationPercentage(
    talentId: string,
    excludeTeamId?: string,
  ): Promise<number> {
    return this.handleDatabaseOperation(
      async () => {
        const queryBuilder = this.assignmentRepository
          .createQueryBuilder('assignment')
          .select('SUM(assignment.allocationPercentage)', 'total')
          .where('assignment.talentId = :talentId', { talentId });

        if (excludeTeamId) {
          queryBuilder.andWhere('assignment.teamId != :excludeTeamId', {
            excludeTeamId,
          });
        }

        const result = await queryBuilder.getRawOne();
        return parseFloat(result?.total || '0');
      },
      `getTotalAllocationPercentage(${talentId}, ${excludeTeamId || 'none'})`,
    );
  }
}

