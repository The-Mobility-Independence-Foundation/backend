import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Delete,
  Patch,
  UploadedFiles,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { SearchListingsDto } from './dto/search-listings.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateListingDto } from './dto/create-listing.dto';
import { User } from '../user/entities/user.entity';
import { UpdateListingDto } from './dto/update-listing.dto';
import { FileUpload } from '../common/decorators/file-upload.decorator';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { ListingResponse } from './responses/listing.response';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FilesValidationPipe } from '../common/pipes/files-validation.pipe';

@ApiTags('listings')
@Controller('listings')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all listings' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved listings',
    type: BaseApiCursorPaginationResponse,
  })
  @ResponseMessage('Successfully retrieved listings')
  findAll(@CurrentUser() user: User, @Query() query: SearchListingsDto) {
    return this.listingsService.findAll(user, query);
  }

  @Post()
  @FileUpload({
    properties: {
      inventoryItemId: {
        type: 'number',
        description: 'The id of the inventory item',
        example: 1,
      },
      name: {
        type: 'string',
        description: 'The name of the listing',
        example: 'My Listing',
      },
      description: {
        type: 'string',
        description: 'The description of the listing',
        example: 'This is a description of my listing',
      },
      quantity: {
        type: 'number',
        description: 'The quantity of the listing',
        example: 1,
      },
      attributes: {
        type: 'object',
        description: 'The attributes of the listing',
        example: {
          color: 'red',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created listing',
    type: ListingResponse,
  })
  @ResponseMessage('Successfully created listing')
  create(
    @CurrentUser() user: User,
    @Body() createListingDto: CreateListingDto,
    @UploadedFiles(new FilesValidationPipe({ fileIsRequired: false }))
    files: Express.Multer.File[],
  ) {
    return this.listingsService.create(user, createListingDto, files);
  }

  @Get('/:listingId')
  @ApiOperation({ summary: 'Get a specific listing by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved listing',
    type: ListingResponse,
  })
  @ResponseMessage('Successfully retrieved listing')
  findOne(@Param('listingId') listingId: number) {
    return this.listingsService.findByIdOrThrow(listingId);
  }

  @Patch('/:listingId')
  @ApiOperation({ summary: 'Update a specific listing by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated listing',
    type: ListingResponse,
  })
  @ResponseMessage('Successfully updated listing')
  update(
    @CurrentUser() user: User,
    @Param('listingId') listingId: number,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(user, listingId, updateListingDto);
  }

  @Delete('/:listingId')
  @ApiOperation({ summary: 'Delete a specific listing by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted listing',
  })
  @ResponseMessage('Successfully deleted listing')
  delete(@CurrentUser() user: User, @Param('listingId') listingId: number) {
    return this.listingsService.delete(user, listingId);
  }
}
