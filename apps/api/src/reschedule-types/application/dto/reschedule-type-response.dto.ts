/**
 * Reschedule Type Response DTO
 */
import { ApiProperty } from '@nestjs/swagger';

export class RescheduleTypeResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the reschedule type',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the reschedule type',
    example: 'Scope Change',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the reschedule type',
    example: 'Change due to scope modification',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Date and time when the reschedule type was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the reschedule type was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  constructor(entity: {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

