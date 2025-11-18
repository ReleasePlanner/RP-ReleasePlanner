/**
 * Base Phase Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Phase } from '../domain/base-phase.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { validateString } from '@rp-release-planner/rp-shared';

export interface IBasePhaseRepository extends IRepository<Phase> {
  findByName(name: string): Promise<Phase | null>;
  findByColor(color: string): Promise<Phase | null>;
}

@Injectable()
export class BasePhaseRepository
  extends BaseRepository<Phase>
  implements IBasePhaseRepository
{
  constructor(
    @InjectRepository(Phase)
    repository: Repository<Phase>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Phase | null> {
    // Defensive: Validate name before query
    validateString(name, 'Phase name');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { name: name.toLowerCase() } as any,
      }),
      `findByName(${name})`,
    );
  }

  async findByColor(color: string): Promise<Phase | null> {
    // Defensive: Validate color before query
    validateString(color, 'Phase color');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { color: color.toLowerCase() } as any,
      }),
      `findByColor(${color})`,
    );
  }
}
