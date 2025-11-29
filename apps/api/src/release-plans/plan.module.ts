/**
 * Plan Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './presentation/plan.controller';
import { PlanService } from './application/plan.service';
import { PlanRepository } from './infrastructure/plan.repository';
import { Plan } from './domain/plan.entity';
import { PlanPhase } from './domain/plan-phase.entity';
import { PlanTask } from './domain/plan-task.entity';
import { PlanMilestone } from './domain/plan-milestone.entity';
import { PlanReference } from './domain/plan-reference.entity';
import { PhaseReschedule } from './domain/phase-reschedule.entity';
import { PlanReferenceType } from './domain/plan-reference-type.entity';
import { PlanComponentVersion } from './domain/plan-component-version.entity';
import { FeatureModule } from '../features/feature.module';
import { Feature } from '../features/domain/feature.entity';
import { OwnersModule } from '../owners/owners.module';
import { RescheduleTypeModule } from '../reschedule-types/reschedule-type.module';
import { RescheduleType } from '../reschedule-types/domain/reschedule-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      PlanPhase,
      PlanTask,
      PlanMilestone,
      PlanReference,
      PlanReferenceType,
      PlanComponentVersion, // Import PlanComponentVersion for version history
      PhaseReschedule, // Import PhaseReschedule for phase reschedule tracking
      Feature, // Import Feature entity for transactional updates
      RescheduleType, // Import RescheduleType for default reschedule type creation
    ]),
    FeatureModule, // Import FeatureModule to access FeatureRepository
    OwnersModule, // Import OwnersModule to access Owner entity
    RescheduleTypeModule, // Import RescheduleTypeModule to access RescheduleType entity
  ],
  controllers: [PlanController],
  providers: [
    PlanService,
    {
      provide: 'IPlanRepository',
      useClass: PlanRepository,
    },
  ],
  exports: [PlanService, 'IPlanRepository'],
})
export class PlanModule {}
