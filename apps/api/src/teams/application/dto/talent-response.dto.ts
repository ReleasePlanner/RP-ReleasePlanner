import { ApiProperty } from '@nestjs/swagger';

export class TalentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the talent',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the talent',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the talent',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Phone number of the talent',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'ID of the role/profile of the talent',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  roleId?: string;

  @ApiProperty({
    description: 'Role information',
    required: false,
  })
  role?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;
}

