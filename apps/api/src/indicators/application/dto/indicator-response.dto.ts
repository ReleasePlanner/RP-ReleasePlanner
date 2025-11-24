/**
 * Indicator Response DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { Indicator, IndicatorStatus } from '../../domain/indicator.entity';

export class IndicatorResponseDto {
  @ApiProperty({
    description: 'Indicator unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Indicator name',
    example: 'Customer Satisfaction Score',
  })
  name: string;

  @ApiProperty({
    description: 'Indicator description',
    example: 'Measures overall customer satisfaction with the product',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Indicator formula',
    example: '(positive_responses / total_responses) * 100',
    required: false,
  })
  formula?: string;

  @ApiProperty({
    description: 'Indicator status',
    enum: IndicatorStatus,
    example: IndicatorStatus.ACTIVE,
  })
  status: IndicatorStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(indicator: Indicator) {
    this.id = indicator.id;
    this.name = indicator.name;
    this.description = indicator.description;
    this.formula = indicator.formula;
    this.status = indicator.status;
    this.createdAt = indicator.createdAt;
    this.updatedAt = indicator.updatedAt;
  }
}

