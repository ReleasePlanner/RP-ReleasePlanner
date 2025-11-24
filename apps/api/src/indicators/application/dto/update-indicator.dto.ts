/**
 * Update Indicator DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { IndicatorStatus } from '../../domain/indicator.entity';

export class UpdateIndicatorDto {
  @ApiProperty({
    description: 'Indicator name',
    example: 'Customer Satisfaction Score',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Indicator name must not exceed 255 characters' })
  name?: string;

  @ApiProperty({
    description: 'Indicator description',
    example: 'Measures overall customer satisfaction with the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Indicator formula (optional)',
    example: '(positive_responses / total_responses) * 100',
    required: false,
  })
  @IsString()
  @IsOptional()
  formula?: string;

  @ApiProperty({
    description: 'Indicator status',
    enum: IndicatorStatus,
    example: IndicatorStatus.ACTIVE,
    required: false,
  })
  @IsEnum(IndicatorStatus, {
    message: `Status must be one of: ${Object.values(IndicatorStatus).join(', ')}`,
  })
  @IsOptional()
  status?: IndicatorStatus;
}

