import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({
    description: "Name of the role",
    example: "Senior Developer",
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: "Role name is required" })
  @MaxLength(255)
  name: string;
}

