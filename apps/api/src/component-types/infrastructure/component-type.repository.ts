/**
 * Component Type Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { ProductComponent } from '../domain/component-type.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IComponentTypeRepository extends IRepository<ProductComponent> {
  findByName(name: string): Promise<ProductComponent | null>;
  findByCode(code: string): Promise<ProductComponent | null>;
}

@Injectable()
export class ComponentTypeRepository
  extends BaseRepository<ProductComponent>
  implements IComponentTypeRepository
{
  constructor(
    @InjectRepository(ProductComponent)
    repository: Repository<ProductComponent>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<ProductComponent | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }

  async findByCode(code: string): Promise<ProductComponent | null> {
    return this.repository.findOne({
      where: { code } as any,
    });
  }
}

