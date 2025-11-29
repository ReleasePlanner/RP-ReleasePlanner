/**
 * Create Reschedule Type DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateRescheduleTypeDto {
  @ApiProperty({
    description: 'Name of the reschedule type',
    example: 'Scope Change',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: 'Reschedule type name is required' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @ApiProperty({
    description: 'Description of the reschedule type',
    example: 'Change due to scope modification',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}

