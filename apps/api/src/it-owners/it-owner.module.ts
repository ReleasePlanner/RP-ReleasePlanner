/**
 * Owner Module
 * Previously named ITOwnerModule, renamed to OwnerModule
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITOwnerController } from './presentation/it-owner.controller';
import { ITOwnerService } from './application/it-owner.service';
import { ITOwnerRepository } from './infrastructure/it-owner.repository';
import { Owner } from './domain/it-owner.entity';
// Import OwnerType directly - webpack resolves from src root
import { OwnerType } from '../owners/domain/owner-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, OwnerType])],
  controllers: [ITOwnerController],
  providers: [
    ITOwnerService,
    {
      provide: 'IITOwnerRepository',
      useClass: ITOwnerRepository,
    },
  ],
  exports: [ITOwnerService, 'IITOwnerRepository'],
})
export class ITOwnerModule {}
