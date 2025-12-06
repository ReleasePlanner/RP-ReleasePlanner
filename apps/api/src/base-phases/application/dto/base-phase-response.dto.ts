/**
 * Base Phase Response DTO
 */
import { ApiProperty } from "@nestjs/swagger";
import {
  BASE_PHASE_API_PROPERTY_DESCRIPTIONS,
  BASE_PHASE_API_PROPERTY_EXAMPLES,
} from "../../constants";

export class BasePhaseResponseDto {
  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.ID,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.ID,
  })
  id: string;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.NAME,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.NAME,
  })
  name: string;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.COLOR,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.COLOR,
  })
  color: string;

  @ApiProperty({
    description:
      "Indicates if this phase should be included by default when creating a new plan",
    example: true,
  })
  isDefault: boolean;

  @ApiProperty({
    description:
      "Sequential order for displaying phases in maintenance (1, 2, 3, etc.)",
    example: 1,
    required: false,
  })
  sequence?: number;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.CREATED_AT,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.DATETIME,
  })
  createdAt: Date;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.UPDATED_AT,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.DATETIME,
  })
  updatedAt: Date;

  constructor(entity: {
    id: string;
    name: string;
    color: string;
    isDefault?: boolean;
    sequence?: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = entity.id;
    this.name = entity.name;
    this.color = entity.color;
    this.isDefault = entity.isDefault ?? false;
    this.sequence = entity.sequence;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
