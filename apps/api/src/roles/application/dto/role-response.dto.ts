import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../domain/role.entity";

export class RoleResponseDto {
  @ApiProperty({
    description: "Unique identifier of the role",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  id: string;

  @ApiProperty({
    description: "Name of the role",
    example: "Senior Developer",
  })
  name: string;

  @ApiProperty({
    description: "Date and time when the role was created",
    example: "2024-01-01T12:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date and time when the role was last updated",
    example: "2024-01-01T12:30:00.000Z",
  })
  updatedAt: Date;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.createdAt = role.createdAt;
    this.updatedAt = role.updatedAt;
  }
}

