/**
 * Owner Type Entity (TypeORM)
 */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

export enum OwnerTypeName {
  IT = 'IT',
  PO = 'PO',
}

@Entity('owner_types')
@Index(['name'], { unique: true })
export class OwnerType extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: OwnerTypeName;

  constructor(name?: OwnerTypeName) {
    super();
    if (name !== undefined) {
      this.name = name;
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || !Object.values(OwnerTypeName).includes(this.name)) {
      throw new Error(`Invalid owner type: ${this.name}. Must be 'IT' or 'PO'`);
    }
  }
}

