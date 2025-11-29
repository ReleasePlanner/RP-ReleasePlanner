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
import { TeamService } from '../application/team.service';
import { CreateTeamDto } from '../application/dto/create-team.dto';
import { UpdateTeamDto } from '../application/dto/update-team.dto';
import { TeamResponseDto } from '../application/dto/team-response.dto';
import { AddTalentToTeamDto } from '../application/dto/add-talent-to-team.dto';
import { AddMultipleTalentsToTeamDto } from '../application/dto/add-multiple-talents-to-team.dto';
import { CreateTalentAndAssignDto } from '../application/dto/create-talent-and-assign.dto';
import {
  API_TAGS,
  API_OPERATION_SUMMARIES,
  API_RESPONSE_DESCRIPTIONS,
  HTTP_STATUS_CODES,
  API_PARAM_DESCRIPTIONS,
} from '../../common/constants/api-docs.constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.TEAMS || 'teams')
@Controller('teams')
@Public() // TODO: Remove this in production - temporary for development
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Get()
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [TeamResponseDto],
  })
  async findAll(): Promise<TeamResponseDto[]> {
    return this.service.findAll();
  }

  @Post(':teamId/talents/add-multiple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add multiple existing talents to a team atomically' })
  @ApiParam({
    name: 'teamId',
    description: 'ID of the team',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: AddMultipleTalentsToTeamDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: 'Talents successfully added to team',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    description: API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async addMultipleTalentsToTeam(
    @Param('teamId') teamId: string,
    @Body() dto: AddMultipleTalentsToTeamDto,
  ): Promise<TeamResponseDto> {
    return this.service.addMultipleTalentsToTeam(teamId, dto);
  }

  @Post(':teamId/talents/create-and-assign')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new talent and assign it to a team atomically' })
  @ApiParam({
    name: 'teamId',
    description: 'ID of the team',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: CreateTalentAndAssignDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CREATED,
    description: 'Talent created and assigned to team successfully',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    description: API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async createTalentAndAssign(
    @Param('teamId') teamId: string,
    @Body() dto: CreateTalentAndAssignDto,
  ): Promise<TeamResponseDto> {
    return this.service.createTalentAndAssign(teamId, dto);
  }

  @Post(':teamId/talents/add')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add an existing talent to a team' })
  @ApiParam({
    name: 'teamId',
    description: 'ID of the team',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: AddTalentToTeamDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: 'Talent successfully added to team',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    description: API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async addTalentToTeam(
    @Param('teamId') teamId: string,
    @Body() dto: AddTalentToTeamDto,
  ): Promise<TeamResponseDto> {
    return this.service.addTalentToTeam(teamId, dto);
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
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<TeamResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CREATED,
    description: API_RESPONSE_DESCRIPTIONS.CREATED,
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    description: API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateTeamDto): Promise<TeamResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: API_PARAM_DESCRIPTIONS.ID,
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: TeamResponseDto,
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
    @Body() dto: UpdateTeamDto,
  ): Promise<TeamResponseDto> {
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
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

