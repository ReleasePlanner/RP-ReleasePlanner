import { ApiProperty } from '@nestjs/swagger';
import { TeamTalentAssignment } from '../../domain/team-talent-assignment.entity';

export class TeamTalentAssignmentResponseDto {
  @ApiProperty({
    description: 'ID of the team',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  teamId: string;

  @ApiProperty({
    description: 'ID of the talent',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  talentId: string;

  @ApiProperty({
    description: 'Allocation percentage for this assignment (0-100)',
    example: 50.5,
  })
  allocationPercentage: number;

  @ApiProperty({
    description: 'Talent information',
    nullable: true,
  })
  talent?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    roleId?: string;
    role?: {
      id: string;
      name: string;
    };
  };

  @ApiProperty({
    description: 'Date and time when the assignment was created',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the assignment was last updated',
    example: '2024-01-01T12:30:00.000Z',
  })
  updatedAt: Date;

  constructor(assignment: TeamTalentAssignment) {
    this.teamId = assignment.teamId;
    this.talentId = assignment.talentId;
    this.allocationPercentage = assignment.allocationPercentage;
    if (assignment.talent) {
      this.talent = {
        id: assignment.talent.id,
        name: assignment.talent.name,
        email: assignment.talent.email,
        phone: assignment.talent.phone,
        roleId: assignment.talent.roleId,
      };
      if (assignment.talent.role) {
        this.talent.role = {
          id: assignment.talent.role.id,
          name: assignment.talent.role.name,
        };
      }
    }
    this.createdAt = assignment.createdAt;
    this.updatedAt = assignment.updatedAt;
  }
}

