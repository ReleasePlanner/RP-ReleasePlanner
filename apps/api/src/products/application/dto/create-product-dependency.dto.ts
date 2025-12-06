import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsOptional } from "class-validator";

export class CreateProductDependencyDto {
  @ApiProperty({
    description: "ID of the dependency product (satellite product)",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @IsUUID()
  dependencyProductId: string;

  @ApiProperty({
    description: "ID of the owner responsible for this dependency",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @ApiProperty({
    description: "ID of the technical lead (talent) for this dependency",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  technicalLeadId?: string;
}

