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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';

@ApiTags('organization')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ResponseMessage('Successfully created organization')
  @ApiOperation({ summary: 'Create an organization' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
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

  @Get(':orgId')
  @ResponseMessage('Successfully found organization')
  @ApiOperation({ summary: 'Get an organization from their id' })
  findOne(@Param('orgId') id: number) {
    return this.organizationService.findByIdOrThrow(id);
  }

  @Patch(':orgId')
  @ResponseMessage('Successfully updated organization')
  @ApiOperation({ summary: 'Update an organization' })
  @UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_OWNER)
  update(@Param('orgId') id: number, @Body() dto: UpdateOrganizationDto) {
    return this.organizationService.update(id, dto);
  }

  @Get(':orgId/users')
  @ResponseMessage('Successfully found users')
  @ApiOperation({ summary: 'Get all users in an organization' })
  findUsers(@Param('orgId') id: number) {
    return this.organizationService.getUsers(id);
  }
}
