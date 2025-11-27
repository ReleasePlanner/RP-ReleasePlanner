import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';
import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTeamTalentAssignmentDto } from './create-team-talent-assignment.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @ApiProperty({
    description: 'The ID of the team to update',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Timestamp of the last update for optimistic locking',
    example: '2024-01-01T12:00:00.000Z',
  })
  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @ApiProperty({
    description: 'List of talent assignments with allocation percentages',
    type: [CreateTeamTalentAssignmentDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamTalentAssignmentDto)
  talentAssignments?: CreateTeamTalentAssignmentDto[];
}

