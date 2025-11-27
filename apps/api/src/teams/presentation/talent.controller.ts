import {
  Controller,
  Get,
  Post,
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
import { TalentService } from '../application/talent.service';
import { CreateTalentDto } from '../application/dto/create-talent.dto';
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new talent' })
  @ApiBody({ type: CreateTalentDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CREATED,
    description: API_RESPONSE_DESCRIPTIONS.CREATED,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    description: API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateTalentDto) {
    return this.service.create(dto);
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
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }
}

