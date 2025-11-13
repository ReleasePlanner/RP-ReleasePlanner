/**
 * Prometheus Metrics Module
 * 
 * Configures Prometheus metrics collection for the API
 */
import { Module } from '@nestjs/common';
import { PrometheusModule as NestPrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    NestPrometheusModule.register({
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'release_planner_',
        },
      },
    }),
  ],
  controllers: [MetricsController],
  exports: [NestPrometheusModule],
})
export class PrometheusMetricsModule {}

