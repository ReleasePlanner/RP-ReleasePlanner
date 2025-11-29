import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdatePhaseRescheduleDto {
  @ApiProperty({
    description: 'Reschedule type ID',
    example: 'uuid-here',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  rescheduleTypeId?: string;

  @ApiProperty({
    description: 'Owner ID who approved the reschedule',
    example: 'uuid-here',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  ownerId?: string;
}

