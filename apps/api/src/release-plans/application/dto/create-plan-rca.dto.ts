import { IsString, IsOptional, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePlanRcaDto {
  @ApiProperty({
    description: "Support ticket number",
    example: "TICKET-12345",
    required: false,
  })
  @IsString()
  @IsOptional()
  supportTicketNumber?: string;

  @ApiProperty({
    description: "RCA number",
    example: "RCA-001",
    required: false,
  })
  @IsString()
  @IsOptional()
  rcaNumber?: string;

  @ApiProperty({
    description: "Key issues tags",
    example: ["performance", "security", "availability"],
    required: false,
  })
  @IsArray()
  @IsOptional()
  keyIssuesTags?: string[];

  @ApiProperty({
    description: "Learnings tags",
    example: ["monitoring", "documentation", "testing"],
    required: false,
  })
  @IsArray()
  @IsOptional()
  learningsTags?: string[];

  @ApiProperty({
    description: "Technical description",
    example: "Detailed technical description of the root cause analysis",
    required: false,
  })
  @IsString()
  @IsOptional()
  technicalDescription?: string;

  @ApiProperty({
    description: "Reference file URL",
    example: "https://example.com/files/rca-document.pdf",
    required: false,
  })
  @IsString()
  @IsOptional()
  referenceFileUrl?: string;
}

