import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateTeamTalentAssignmentDto {
  @ApiProperty({
    description: 'ID of the talent to assign',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Talent ID is required' })
  talentId: string;

  @ApiProperty({
    description: 'Allocation percentage for this assignment (0-100)',
    example: 50.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Allocation percentage must be at least 0' })
  @Max(100, { message: 'Allocation percentage must not exceed 100' })
  @IsNotEmpty({ message: 'Allocation percentage is required' })
  allocationPercentage: number;
}

