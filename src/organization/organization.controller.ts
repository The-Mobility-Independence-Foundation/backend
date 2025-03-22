import { Controller, Param, Post, Get, Body, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { GetOrganizationsDto } from './dto/get-organizations.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetOrganizationsDto) {
    return this.organizationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.organizationService.findByIdOrThrow(id);
  }
}
