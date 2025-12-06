/**
 * Plan RCA Controller
 * 
 * Presentation layer - HTTP endpoints
 */
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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { API_TAGS } from '../../common/constants';
import { PlanRcaService } from '../application/plan-rca.service';
import { CreatePlanRcaDto } from '../application/dto/create-plan-rca.dto';
import { UpdatePlanRcaDto } from '../application/dto/update-plan-rca.dto';
import { PlanRcaResponseDto } from '../application/dto/plan-rca-response.dto';
import { CacheResult, InvalidateCache } from '../../common/decorators/cache.decorator';
import { CacheInvalidateInterceptor } from '../../common/interceptors/cache-invalidate.interceptor';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.RELEASE_PLANS)
@Controller('plans/:planId/rcas')
@Public() // TODO: Remove this in production - temporary for development
@UseInterceptors(CacheInvalidateInterceptor)
export class PlanRcaController {
  constructor(private readonly service: PlanRcaService) {}

  @Get()
  @CacheResult(300, 'plan-rcas')
  @ApiOperation({ summary: 'Get all RCAs for a plan' })
  @ApiParam({
    name: 'planId',
    description: 'Unique identifier of the plan',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of RCAs retrieved successfully',
    type: [PlanRcaResponseDto],
  })
  async findByPlanId(@Param('planId') planId: string): Promise<PlanRcaResponseDto[]> {
    return this.service.findByPlanId(planId);
  }

  @Get(':id')
  @CacheResult(300, 'plan-rcas')
  @ApiOperation({ summary: 'Get RCA by ID' })
  @ApiParam({
    name: 'planId',
    description: 'Unique identifier of the plan',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the RCA',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'RCA retrieved successfully',
    type: PlanRcaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'RCA not found',
  })
  async findById(
    @Param('planId') planId: string,
    @Param('id') id: string,
  ): Promise<PlanRcaResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @InvalidateCache('plan-rcas')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new RCA for a plan' })
  @ApiParam({
    name: 'planId',
    description: 'Unique identifier of the plan',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: CreatePlanRcaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'RCA created successfully',
    type: PlanRcaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan not found',
  })
  async create(
    @Param('planId') planId: string,
    @Body() dto: CreatePlanRcaDto,
  ): Promise<PlanRcaResponseDto> {
    return this.service.create(planId, dto);
  }

  @Put(':id')
  @InvalidateCache('plan-rcas')
  @ApiOperation({ summary: 'Update a RCA' })
  @ApiParam({
    name: 'planId',
    description: 'Unique identifier of the plan',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the RCA',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: UpdatePlanRcaDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'RCA updated successfully',
    type: PlanRcaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'RCA not found',
  })
  async update(
    @Param('planId') planId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePlanRcaDto,
  ): Promise<PlanRcaResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @InvalidateCache('plan-rcas')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a RCA' })
  @ApiParam({
    name: 'planId',
    description: 'Unique identifier of the plan',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the RCA',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'RCA deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'RCA not found',
  })
  async delete(
    @Param('planId') planId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.service.delete(id);
  }
}

