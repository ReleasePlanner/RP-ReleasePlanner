/**
 * Reschedule Type Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { RescheduleType } from '../domain/reschedule-type.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { validateString } from '@rp-release-planner/rp-shared';

export interface IRescheduleTypeRepository extends IRepository<RescheduleType> {
  findByName(name: string): Promise<RescheduleType | null>;
}

@Injectable()
export class RescheduleTypeRepository
  extends BaseRepository<RescheduleType>
  implements IRescheduleTypeRepository
{
  constructor(
    @InjectRepository(RescheduleType)
    repository: Repository<RescheduleType>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<RescheduleType | null> {
    validateString(name, 'Reschedule type name');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { name } as any,
      }),
      `findByName(${name})`,
    );
  }
}

