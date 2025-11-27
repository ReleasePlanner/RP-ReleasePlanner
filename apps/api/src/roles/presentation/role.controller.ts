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
import { RoleService } from "../application/role.service";
import { CreateRoleDto } from "../application/dto/create-role.dto";
import { UpdateRoleDto } from "../application/dto/update-role.dto";
import { RoleResponseDto } from "../application/dto/role-response.dto";
import {
  API_TAGS,
  API_OPERATION_SUMMARIES,
  API_RESPONSE_DESCRIPTIONS,
  HTTP_STATUS_CODES,
  API_PARAM_DESCRIPTIONS,
} from "../../common/constants/api-docs.constants";
import { Public } from "../../auth/decorators/public.decorator";

@ApiTags(API_TAGS.ROLES || "roles")
@Controller("roles")
@Public() // TODO: Remove this in production - temporary for development
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [RoleResponseDto],
  })
  async findAll(): Promise<RoleResponseDto[]> {
    return this.service.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: "id",
    description: API_PARAM_DESCRIPTIONS.ID,
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param("id") id: string): Promise<RoleResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CREATED,
    description: API_RESPONSE_DESCRIPTIONS.CREATED,
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    description: API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.CONFLICT,
    description: API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.service.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: "id",
    description: API_PARAM_DESCRIPTIONS.ID,
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: HTTP_STATUS_CODES.OK,
    description: API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: RoleResponseDto,
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
    @Param("id") id: string,
    @Body() dto: UpdateRoleDto
  ): Promise<RoleResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: "id",
    description: API_PARAM_DESCRIPTIONS.ID,
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NO_CONTENT,
    description: API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    description: API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param("id") id: string): Promise<void> {
    return this.service.delete(id);
  }
}

