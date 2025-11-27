import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MaxLength, IsEmail } from 'class-validator';

export class UpdateTalentDto {
  @ApiProperty({
    description: 'Name of the talent',
    example: 'John Doe',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'Email address of the talent',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Phone number of the talent',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({
    description: 'ID of the role/profile of the talent',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  roleId?: string;
}

