/**
 * Indicator Controller
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { IndicatorService } from '../application/indicator.service';
import { CreateIndicatorDto } from '../application/dto/create-indicator.dto';
import { UpdateIndicatorDto } from '../application/dto/update-indicator.dto';
import { IndicatorResponseDto } from '../application/dto/indicator-response.dto';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.INDICATORS)
@Controller('indicators')
@Public() // TODO: Remove this in production - temporary for development
export class IndicatorController {
  constructor(private readonly service: IndicatorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all indicators' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of indicators retrieved successfully',
    type: [IndicatorResponseDto],
  })
  async findAll(): Promise<IndicatorResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get indicator by ID' })
  @ApiParam({
    name: 'id',
    description: 'Indicator unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Indicator retrieved successfully',
    type: IndicatorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Indicator not found',
  })
  async findById(@Param('id') id: string): Promise<IndicatorResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new indicator' })
  @ApiBody({ type: CreateIndicatorDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Indicator created successfully',
    type: IndicatorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Indicator with the same name already exists',
  })
  async create(@Body() dto: CreateIndicatorDto): Promise<IndicatorResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an indicator' })
  @ApiParam({
    name: 'id',
    description: 'Indicator unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateIndicatorDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Indicator updated successfully',
    type: IndicatorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Indicator not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Indicator with the same name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIndicatorDto,
  ): Promise<IndicatorResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an indicator' })
  @ApiParam({
    name: 'id',
    description: 'Indicator unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Indicator deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Indicator not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

