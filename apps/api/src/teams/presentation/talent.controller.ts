import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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
import { TalentService } from '../application/talent.service';
import { CreateTalentDto } from '../application/dto/create-talent.dto';
import { UpdateTalentDto } from '../application/dto/update-talent.dto';
import { TalentResponseDto } from '../application/dto/talent-response.dto';
import {
  API_TAGS,
  API_OPERATION_SUMMARIES,
  API_RESPONSE_DESCRIPTIONS,
  HTTP_STATUS_CODES,
  API_PARAM_DESCRIPTIONS,
} from '../../common/constants/api-docs.constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.TEAMS || 'teams')
@Controller('teams/talents')
@Public() // TODO: Remove this in production - temporary for development
export class TalentController {
  constructor(private readonly service: TalentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all talents' })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: [TalentResponseDto],
  })
  async findAll(): Promise<TalentResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id/allocation-total')
  @ApiOperation({ summary: 'Get total allocation percentage for a talent' })
  @ApiParam({
    name: 'id',
    description: API_PARAM_DESCRIPTIONS.ID,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: 'Total allocation percentage retrieved',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          description: 'Total allocation percentage across all teams',
          example: 75.5,
        },
      },
    },
  })
  async getTotalAllocation(
    @Param('id') id: string,
    @Query('excludeTeamId') excludeTeamId?: string,
  ): Promise<{ total: number }> {
    const total = await this.service.getTotalAllocationPercentage(
      id,
      excludeTeamId,
    );
    return { total };
  }

  @Get(':id')
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: API_PARAM_DESCRIPTIONS.ID,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: TalentResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<TalentResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new talent' })
  @ApiBody({ type: CreateTalentDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CREATED,
    description: API_RESPONSE_DESCRIPTIONS.CREATED,
    type: TalentResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    description: API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateTalentDto): Promise<TalentResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: API_PARAM_DESCRIPTIONS.ID,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: UpdateTalentDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: TalentResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTalentDto,
  ): Promise<TalentResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: API_PARAM_DESCRIPTIONS.ID,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NO_CONTENT,
    description: API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}

