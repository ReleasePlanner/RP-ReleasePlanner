import { ApiProperty } from '@nestjs/swagger';
import { Team, TeamType } from '../../domain/team.entity';
import { TeamTalentAssignmentResponseDto } from './team-talent-assignment-response.dto';

export class TeamResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the team',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the team',
    example: 'Frontend Development Team',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the team',
    example: 'Team responsible for frontend development and UI/UX',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Type of team',
    enum: TeamType,
    example: TeamType.INTERNAL,
  })
  type: TeamType;

  @ApiProperty({
    description: 'List of talent assignments with allocation percentages',
    type: [TeamTalentAssignmentResponseDto],
  })
  talentAssignments: TeamTalentAssignmentResponseDto[];

  @ApiProperty({
    description: 'Date and time when the team was created',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the team was last updated',
    example: '2024-01-01T12:30:00.000Z',
  })
  updatedAt: Date;

  constructor(team: Team) {
    this.id = team.id;
    this.name = team.name;
    this.description = team.description;
    this.type = team.type;
    this.talentAssignments = (team.talentAssignments && Array.isArray(team.talentAssignments))
      ? team.talentAssignments.map((assignment) => new TeamTalentAssignmentResponseDto(assignment))
      : [];
    this.createdAt = team.createdAt;
    this.updatedAt = team.updatedAt;
  }
}

