/**
 * Reschedule Type Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RescheduleTypeController } from './presentation/reschedule-type.controller';
import { RescheduleTypeService } from './application/reschedule-type.service';
import { RescheduleTypeRepository } from './infrastructure/reschedule-type.repository';
import { RescheduleType } from './domain/reschedule-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RescheduleType])],
  controllers: [RescheduleTypeController],
  providers: [
    RescheduleTypeService,
    {
      provide: 'IRescheduleTypeRepository',
      useClass: RescheduleTypeRepository,
    },
  ],
  exports: [RescheduleTypeService, 'IRescheduleTypeRepository'],
})
export class RescheduleTypeModule {}

