import { PartialType } from "@nestjs/mapped-types";
import {
  CreatePlanDto,
  CreatePlanPhaseDto,
  CreatePlanTaskDto,
} from "./create-plan.dto";
import {
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
  IsDateString,
  IsObject,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PlanStatus, ReleaseStatus } from "../../domain/plan.entity";
import {
  PLAN_API_PROPERTY_DESCRIPTIONS,
  PLAN_API_PROPERTY_EXAMPLES,
} from "../../constants";

export class UpdatePlanPhaseDto {
  @ApiProperty({
    description: "Phase ID (for existing phases)",
    example: "uuid-here",
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_NAME,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_NAME,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_START_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_START_DATE,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_END_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_END_DATE,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_COLOR,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_COLOR,
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: "Metric values for this phase (indicatorId -> value)",
    example: { "indicator-1": "100", "indicator-2": "50" },
    required: false,
  })
  @IsOptional()
  metricValues?: Record<string, string>;

  @ApiProperty({
    description: "Sequential order of this phase (1, 2, 3, etc.)",
    example: 1,
    required: false,
  })
  @IsOptional()
  sequence?: number;

  @ApiProperty({
    description: "Reschedule type ID (optional, used when dates change)",
    example: "uuid-here",
    required: false,
  })
  @IsString()
  @IsOptional()
  rescheduleTypeId?: string;

  @ApiProperty({
    description: "Owner ID who approved the reschedule (optional)",
    example: "uuid-here",
    required: false,
  })
  @IsString()
  @IsOptional()
  rescheduleOwnerId?: string;
}

export class UpdatePlanMilestoneDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONE_NAME,
    example: PLAN_API_PROPERTY_EXAMPLES.MILESTONE_NAME,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONE_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.MILESTONE_DATE,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONE_DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_PHASE_ID,
    required: false,
  })
  @IsString()
  @IsOptional()
  phaseId?: string;
}

export class UpdatePlanReferenceDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_TYPE,
    enum: ["link", "document", "note", "comment", "file", "milestone"],
  })
  @IsString()
  @IsOptional()
  type?: string; // Content type: link, document, note, comment, file, milestone

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_TITLE,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_URL,
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Plan reference type ID (plan, period, or day)",
    required: false,
  })
  @IsString()
  @IsOptional()
  planReferenceTypeId?: string; // Reference level: plan, period, day

  @ApiProperty({
    description: "Period day (for period type references)",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  periodDay?: string; // For 'period' type: specific day within the period

  @ApiProperty({
    description: "Calendar day ID (for day type references)",
    required: false,
  })
  @IsString()
  @IsOptional()
  calendarDayId?: string; // For 'day' type: specific calendar day

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_PHASE_ID,
    required: false,
  })
  @IsString()
  @IsOptional()
  phaseId?: string; // For 'day' type: phase associated with the day

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_DATE,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string; // Legacy field - deprecated, use periodDay or calendarDayId

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_MILESTONE_COLOR,
    required: false,
  })
  @IsString()
  @IsOptional()
  milestoneColor?: string;
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @IsEnum(PlanStatus)
  @IsOptional()
  override status?: PlanStatus;

  @ApiProperty({
    description: 'Release status: To Be Defined (default), Success, Rollback, or Partial RollBack',
    enum: ReleaseStatus,
    example: ReleaseStatus.TO_BE_DEFINED,
    required: false,
  })
  @IsEnum(ReleaseStatus)
  @IsOptional()
  releaseStatus?: ReleaseStatus;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.TASKS_LIST,
    type: [CreatePlanTaskDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanTaskDto)
  tasks?: CreatePlanTaskDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONES_LIST,
    type: [UpdatePlanMilestoneDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanMilestoneDto)
  milestones?: UpdatePlanMilestoneDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCES_LIST,
    type: [UpdatePlanReferenceDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanReferenceDto)
  references?: UpdatePlanReferenceDto[];

  // Note: cellData has been removed - references (comments, files, links) are now handled via plan_references table

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASES_LIST,
    type: [UpdatePlanPhaseDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanPhaseDto)
  override phases?: UpdatePlanPhaseDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.COMPONENTS_LIST,
    required: false,
  })
  @IsArray()
  @IsOptional()
  components?: Array<{
    componentId: string;
    currentVersion: string;
    finalVersion: string;
  }>;

  @ApiProperty({
    description:
      "Timestamp for optimistic locking. If provided, update will fail if plan was modified since this timestamp.",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}
