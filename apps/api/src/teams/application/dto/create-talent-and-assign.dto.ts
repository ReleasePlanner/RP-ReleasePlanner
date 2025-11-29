import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, MaxLength } from 'class-validator';

export class CreateTalentAndAssignDto {
  @ApiProperty({
    description: 'Name of the talent',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Talent name is required' })
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Email of the talent',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the talent',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'ID of the role/profile for the talent',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  @IsString()
  @IsOptional()
  roleId?: string;

  @ApiProperty({
    description: 'Allocation percentage for this assignment (0-100)',
    example: 50.5,
    minimum: 0,
    maximum: 100,
    default: 100,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Allocation percentage must be at least 0' })
  @Max(100, { message: 'Allocation percentage must not exceed 100' })
  @IsNotEmpty({ message: 'Allocation percentage is required' })
  allocationPercentage: number;
}

