import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { AddTalentToTeamDto } from "./add-talent-to-team.dto";

export class AddMultipleTalentsToTeamDto {
  @ApiProperty({
    description: "List of talents to add to the team with their allocation percentages",
    type: [AddTalentToTeamDto],
  })
  @IsArray()
  @IsNotEmpty({ message: "At least one talent is required" })
  @ValidateNested({ each: true })
  @Type(() => AddTalentToTeamDto)
  talents: AddTalentToTeamDto[];
}

