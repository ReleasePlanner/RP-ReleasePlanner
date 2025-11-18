/**
 * Phase Module
 * Previously named BasePhaseModule, renamed to PhaseModule
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasePhaseController } from './presentation/base-phase.controller';
import { BasePhaseService } from './application/base-phase.service';
import { BasePhaseRepository } from './infrastructure/base-phase.repository';
import { Phase } from './domain/base-phase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phase])],
  controllers: [BasePhaseController],
  providers: [
    BasePhaseService,
    {
      provide: 'IBasePhaseRepository',
      useClass: BasePhaseRepository,
    },
  ],
  exports: [BasePhaseService, 'IBasePhaseRepository'],
})
export class BasePhaseModule {}

