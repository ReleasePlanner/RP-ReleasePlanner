import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { TeamType } from '../../domain/team.entity';
import { CreateTeamTalentAssignmentDto } from './create-team-talent-assignment.dto';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Name of the team',
    example: 'Frontend Development Team',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Team name is required' })
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description of the team',
    example: 'Team responsible for frontend development and UI/UX',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of team',
    enum: TeamType,
    example: TeamType.INTERNAL,
    default: TeamType.INTERNAL,
  })
  @IsEnum(TeamType, { message: 'Invalid team type' })
  @IsOptional()
  type?: TeamType;

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

