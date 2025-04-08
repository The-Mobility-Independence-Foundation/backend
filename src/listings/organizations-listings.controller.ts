import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { ListingsService } from './listings.service';
import { SearchListingsDto } from './dto/search-listings.dto';
import { User } from '../user/entities/user.entity';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { OrganizationsSearchListingsDto } from './dto/organizations-search-listings.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('organizations')
@Controller('organizations/:orgId/listings')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
export class OrganizationsListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all listings for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved organization listings',
    type: BaseApiCursorPaginationResponse,
  })
  @ResponseMessage('Successfully retrieved organization listings')
  findAll(
    @CurrentUser() user: User,
    @Param('orgId') organizationId: number,
    @Query() query: OrganizationsSearchListingsDto,
  ) {
    const searchListingsDto: SearchListingsDto = {
      ...query,
      organizationId,
    };

    return this.listingsService.findAll(user, searchListingsDto);
  }
}
