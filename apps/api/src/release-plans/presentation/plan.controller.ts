import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { PlanService } from "../application/plan.service";
import { CreatePlanDto } from "../application/dto/create-plan.dto";
import { UpdatePlanDto } from "../application/dto/update-plan.dto";
import { PlanResponseDto } from "../application/dto/plan-response.dto";
import { PhaseRescheduleResponseDto } from "../application/dto/phase-reschedule-response.dto";
import { UpdatePhaseRescheduleDto } from "../application/dto/update-phase-reschedule.dto";
import {
  PLAN_API_OPERATION_SUMMARIES,
  PLAN_API_RESPONSE_DESCRIPTIONS,
  PLAN_HTTP_STATUS_CODES,
  PLAN_API_PARAM_DESCRIPTIONS,
} from "../constants";
import { API_TAGS } from "../../common/constants";
import { Public } from "../../auth/decorators/public.decorator";

@ApiTags(API_TAGS.PLANS)
@Controller("plans")
@Public() // TODO: Remove this in production - temporary for development
export class PlanController {
  constructor(private readonly service: PlanService) {}

  @Get()
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [PlanResponseDto],
  })
  async findAll(): Promise<PlanResponseDto[]> {
    return this.service.findAll();
  }

  // ⚡ CRITICAL: This endpoint must be defined BEFORE all routes with :id or :planId to avoid route conflicts
  // Using a more specific route path to ensure it's matched correctly
  @Put("reschedules/:rescheduleId/update")
  @ApiOperation({ summary: "Update a phase reschedule (owner and reschedule type only)" })
  @ApiParam({
    name: "rescheduleId",
    description: "Reschedule ID",
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdatePhaseRescheduleDto })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: "Reschedule updated successfully",
    type: PhaseRescheduleResponseDto,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NOT_FOUND,
    description: "Reschedule not found",
  })
  async updateReschedule(
    @Param("rescheduleId") rescheduleId: string,
    @Body() dto: UpdatePhaseRescheduleDto
  ): Promise<PhaseRescheduleResponseDto> {
    return this.service.updateReschedule(rescheduleId, dto);
  }

  // Reschedules endpoints must be defined BEFORE :id route to avoid route conflicts
  @Get(":planId/reschedules")
  @ApiOperation({ summary: "Get all phase reschedules for a plan" })
  @ApiParam({
    name: "planId",
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [PhaseRescheduleResponseDto],
  })
  async getPlanReschedules(
    @Param("planId") planId: string
  ): Promise<PhaseRescheduleResponseDto[]> {
    return this.service.getPlanReschedules(planId);
  }

  @Get(":planId/phases/:phaseId/reschedules")
  @ApiOperation({ summary: "Get reschedules for a specific phase" })
  @ApiParam({
    name: "planId",
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiParam({
    name: "phaseId",
    description: "Phase ID",
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [PhaseRescheduleResponseDto],
  })
  async getPhaseReschedules(
    @Param("planId") planId: string, // planId is not used in service, but kept for route consistency
    @Param("phaseId") phaseId: string
  ): Promise<PhaseRescheduleResponseDto[]> {
    return this.service.getPhaseReschedules(phaseId);
  }

  @Get(":id")
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: "id",
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NOT_FOUND,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param("id") id: string): Promise<PlanResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreatePlanDto })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.CREATED,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.BAD_REQUEST,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.CONFLICT,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.service.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: "id",
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdatePlanDto })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NOT_FOUND,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.CONFLICT,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdatePlanDto
  ): Promise<PlanResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: "id",
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NO_CONTENT,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NOT_FOUND,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param("id") id: string): Promise<void> {
    return this.service.delete(id);
  }
}
