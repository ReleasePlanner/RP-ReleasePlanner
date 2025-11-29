/**
 * Reschedule Type Controller
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
import { RescheduleTypeService } from '../application/reschedule-type.service';
import { CreateRescheduleTypeDto } from '../application/dto/create-reschedule-type.dto';
import { UpdateRescheduleTypeDto } from '../application/dto/update-reschedule-type.dto';
import { RescheduleTypeResponseDto } from '../application/dto/reschedule-type-response.dto';
import { CacheResult, InvalidateCache } from '../../common/decorators/cache.decorator';
import { CacheInvalidateInterceptor } from '../../common/interceptors/cache-invalidate.interceptor';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.BASE_PHASES) // Reuse BASE_PHASES tag or create new one
@Controller('reschedule-types')
@Public() // TODO: Remove this in production - temporary for development
@UseInterceptors(CacheInvalidateInterceptor)
export class RescheduleTypeController {
  constructor(private readonly service: RescheduleTypeService) {}

  @Get()
  @CacheResult(300, 'reschedule-types') // Cache for 5 minutes
  @ApiOperation({ summary: 'Get all reschedule types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of reschedule types retrieved successfully',
    type: [RescheduleTypeResponseDto],
  })
  async findAll(): Promise<RescheduleTypeResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @CacheResult(300, 'reschedule-types')
  @ApiOperation({ summary: 'Get reschedule type by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the reschedule type',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reschedule type retrieved successfully',
    type: RescheduleTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reschedule type not found',
  })
  async findById(@Param('id') id: string): Promise<RescheduleTypeResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @InvalidateCache('reschedule-types')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new reschedule type' })
  @ApiBody({ type: CreateRescheduleTypeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reschedule type created successfully',
    type: RescheduleTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reschedule type with this name already exists',
  })
  async create(@Body() dto: CreateRescheduleTypeDto): Promise<RescheduleTypeResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @InvalidateCache('reschedule-types')
  @ApiOperation({ summary: 'Update a reschedule type' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the reschedule type',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: UpdateRescheduleTypeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reschedule type updated successfully',
    type: RescheduleTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reschedule type not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reschedule type with this name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRescheduleTypeDto,
  ): Promise<RescheduleTypeResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @InvalidateCache('reschedule-types')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reschedule type' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the reschedule type',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Reschedule type deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reschedule type not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

