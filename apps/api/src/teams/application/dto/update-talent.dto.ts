import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTalentDto } from './create-talent.dto';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateTalentDto extends PartialType(CreateTalentDto) {
  @ApiProperty({
    description: 'The ID of the talent to update',
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
}
