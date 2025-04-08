import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from 'src/common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from 'src/common/resource-access/interfaces/strategy-provider.interface';
import { ListingsService } from './listings.service';
import { SearchListingsDto } from './dto/search-listings.dto';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { OrganizationsSearchListingsDto } from './dto/organizations-search-listings.dto';

@ApiTags('organizations')
@Controller('organizations/:orgId/listings')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
export class OrganizationsListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved organization listings')
  @ApiOperation({ summary: 'Get all listings for an organization' })
  findAll(
    @Req() req: Request,
    @Param('orgId') organizationId: number,
    @Query() query: OrganizationsSearchListingsDto,
  ) {
    const user = req.user as User;
    const searchListingsDto: SearchListingsDto = {
      ...query,
      organizationId,
    };

    return this.listingsService.findAll(user, searchListingsDto);
  }
}
