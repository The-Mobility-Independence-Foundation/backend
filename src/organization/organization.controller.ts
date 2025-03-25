import {
  Controller,
  Param,
  Post,
  Get,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { GetOrganizationsDto } from './dto/get-organizations.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // TODO: add guard for this
  @Post()
  @ResponseMessage('Successfully created organization')
  @ApiOperation({ summary: 'Create an organization' })
  async create(@Body() dto: CreateOrganizationDto) {
    const result = await this.organizationService.create(dto);
    this.organizationService.addUser(result.id, dto.ownerId);

    return result;
  }

  @Get()
  @ResponseMessage('Successfully found organizations')
  @ApiOperation({ summary: 'Get a paginated list of organizations' })
  findAll(@Query() query: GetOrganizationsDto) {
    return this.organizationService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Successfully found organization')
  @ApiOperation({ summary: 'Get an organization from their id' })
  findOne(@Param('id') id: number) {
    return this.organizationService.findByIdOrThrow(id);
  }

  // TODO: add guard for this
  @Patch(':id')
  @ResponseMessage('Successfully updated organization')
  @ApiOperation({ summary: 'Update an organization' })
  update(@Param('id') id: number, @Body() dto: UpdateOrganizationDto) {
    return this.organizationService.update(id, dto);
  }

  @Get(':id/users')
  @ResponseMessage('Successfully found users')
  @ApiOperation({ summary: 'Get all users in an organization' })
  findUsers(@Param('id') id: number) {
    return this.organizationService.getUsers(id);
  }
}
