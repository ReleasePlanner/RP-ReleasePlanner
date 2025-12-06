/**
 * Reorder Phases DTO
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, ArrayMinSize } from "class-validator";

export class ReorderPhasesDto {
  @ApiProperty({
    description: "Array of phase IDs in the desired order",
    example: ["phase-id-1", "phase-id-2", "phase-id-3"],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one phase ID is required" })
  @IsString({ each: true })
  phaseIds: string[];
}

