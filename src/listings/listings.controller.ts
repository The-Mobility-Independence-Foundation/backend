import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { SearchListingsDto } from './dto/search-listings.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateListingDto } from './dto/create-listing.dto';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { UpdateListingDto } from './dto/update-listing.dto';

@ApiTags('listings')
@Controller('listings')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved listings')
  @ApiOperation({ summary: 'Get all listings' })
  findAll(@Req() req: Request, @Query() query: SearchListingsDto) {
    const user = req.user as User;
    return this.listingsService.findAll(user, query);
  }

  @Post()
  @ResponseMessage('Successfully created listing')
  @ApiOperation({ summary: 'Create a new listing' })
  create(@Req() req: Request, @Body() createListingDto: CreateListingDto) {
    const user = req.user as User;
    return this.listingsService.create(user, createListingDto);
  }

  @Get('/:listingId')
  @ResponseMessage('Successfully retrieved listing')
  @ApiOperation({ summary: 'Get a specific listing by ID' })
  findOne(@Param('listingId') listingId: number) {
    return this.listingsService.findByIdOrThrow(listingId);
  }

  @Patch('/:listingId')
  @ResponseMessage('Successfully updated listing')
  @ApiOperation({ summary: 'Update a specific listing by ID' })
  update(
    @Req() req: Request,
    @Param('listingId') listingId: number,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    const user = req.user as User;
    return this.listingsService.update(user, listingId, updateListingDto);
  }

  @Delete('/:listingId')
  @ResponseMessage('Successfully deleted listing')
  @ApiOperation({ summary: 'Delete a specific listing by ID' })
  delete(@Req() req: Request, @Param('listingId') listingId: number) {
    const user = req.user as User;
    return this.listingsService.delete(user, listingId);
  }
}
