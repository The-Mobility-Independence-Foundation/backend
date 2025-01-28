import { Controller, Param, Post, Get } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization } from './organization.entity';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(): Promise<Organization> {
    return this.organizationService.create();
  }

  @Get()
  findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Organization | null> {
    return this.organizationService.findOne(id);
  }
}
