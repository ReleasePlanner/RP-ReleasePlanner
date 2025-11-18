/**
 * Owner Repository
 * Previously named ITOwnerRepository
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Owner } from '../domain/it-owner.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IITOwnerRepository extends IRepository<Owner> {
  findByName(name: string): Promise<Owner | null>;
}

@Injectable()
export class ITOwnerRepository
  extends BaseRepository<Owner>
  implements IITOwnerRepository
{
  constructor(
    @InjectRepository(Owner)
    repository: Repository<Owner>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Owner | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }
}
