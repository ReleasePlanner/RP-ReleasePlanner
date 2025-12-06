/**
 * Plan RCA Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { PlanRca } from '../domain/plan-rca.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { validateId } from '@rp-release-planner/rp-shared';

export interface IPlanRcaRepository extends IRepository<PlanRca> {
  findByPlanId(planId: string): Promise<PlanRca[]>;
}

@Injectable()
export class PlanRcaRepository
  extends BaseRepository<PlanRca>
  implements IPlanRcaRepository
{
  constructor(
    @InjectRepository(PlanRca)
    repository: Repository<PlanRca>,
  ) {
    super(repository);
  }

  async findByPlanId(planId: string): Promise<PlanRca[]> {
    validateId(planId, 'Plan');
    
    return this.handleDatabaseOperation(
      () => this.repository.find({
        where: { planId } as any,
        order: { createdAt: 'DESC' },
      }),
      `findByPlanId(${planId})`,
    );
  }
}

