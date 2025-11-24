/**
 * Indicator Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorController } from './presentation/indicator.controller';
import { IndicatorService } from './application/indicator.service';
import { IndicatorRepository } from './infrastructure/indicator.repository';
import { Indicator } from './domain/indicator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Indicator]),
  ],
  controllers: [IndicatorController],
  providers: [
    IndicatorService,
    {
      provide: 'IIndicatorRepository',
      useClass: IndicatorRepository,
    },
  ],
  exports: [IndicatorService, 'IIndicatorRepository'],
})
export class IndicatorModule {}

