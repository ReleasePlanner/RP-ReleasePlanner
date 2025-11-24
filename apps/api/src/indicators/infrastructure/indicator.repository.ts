/**
 * Indicator Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Indicator } from '../domain/indicator.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { validateString, validateId } from '@rp-release-planner/rp-shared';

export interface IIndicatorRepository extends IRepository<Indicator> {
  findByName(name: string): Promise<Indicator | null>;
}

@Injectable()
export class IndicatorRepository
  extends BaseRepository<Indicator>
  implements IIndicatorRepository
{
  constructor(
    @InjectRepository(Indicator)
    repository: Repository<Indicator>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Indicator | null> {
    // Defensive: Validate name before query
    validateString(name, 'Indicator name');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { name } as any,
      }),
      `findByName(${name})`,
    );
  }
}

