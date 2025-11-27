import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleController } from "./presentation/role.controller";
import { RoleService } from "./application/role.service";
import { RoleRepository } from "./infrastructure/role.repository";
import { Role } from "./domain/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: "IRoleRepository",
      useClass: RoleRepository,
    },
  ],
  exports: [RoleService, "IRoleRepository"],
})
export class RoleModule {}

