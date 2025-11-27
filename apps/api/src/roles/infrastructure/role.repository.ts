import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseRepository } from "../../common/database/base.repository";
import { Role } from "../domain/role.entity";
import { IRepository } from "../../common/interfaces/repository.interface";
import { validateString } from "@rp-release-planner/rp-shared";

export interface IRoleRepository extends IRepository<Role> {
  findByName(name: string): Promise<Role | null>;
}

@Injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Role | null> {
    validateString(name, "Role name");
    return this.handleDatabaseOperation(
      () => this.repository.findOne({ where: { name } as any }),
      `findByName(${name})`
    );
  }
}

