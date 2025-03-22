import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItem } from './inventory-item.entity';
import { InventoryItemService } from './inventory-item.service';
import { GetInventoryItemsDto } from './dto/get-inventory-item.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';

@ApiTags('inventoryItem')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventoryItem')
export class InventoryItemController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  /**
   * Create a new inventory item
   * @param dto : All necessary information to create a new item
   * @returns : A message of successful creation
   */
  @Post()
  @ApiOperation({ summary: 'Initiate creation of an inventory item' })
  @ResponseMessage('Successfully created inventory item')
  create(@Body() dto: CreateInventoryItemDto): Promise<InventoryItem> {
    return this.inventoryItemService.create(dto);
  }

  /**
   * Find all items in an organizations inventory
   * @param organizationId : The ID of the organization
   * @param inventoryId : The ID of the specific inventory
   * @returns : A list of items stored within that inventory
   */
  @Get('organization/:organizationId/inventory/:inventoryId/items')
  @ApiOperation({ summary: 'Retrieve all items in a specific inventory' })
  @ResponseMessage('Successfully found all inventory item')
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Query() query: GetInventoryItemsDto,
  ): Promise<BaseApiCursorPaginationResponse<InventoryItem>> {
    return this.inventoryItemService.findAll(
      organizationId,
      inventoryId,
      query,
    );
  }

  /**
   * Find a specifc iventory item
   * @param organizationId : The ID of the organization
   * @param inventoryId : The ID of the inventory
   * @param itemId : The ID of the inventory item
   * @returns : The data of the item
   */
  @Get('organization/:organizationId/inventory/:inventoryId/items/:itemId')
  @ApiOperation({ summary: 'Retrieve a specific item in a specific inventory' })
  @ResponseMessage('Successfully found a specific inventory item')
  findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<InventoryItem | null> {
    return this.inventoryItemService.findWithOrgInv(
      organizationId,
      inventoryId,
      itemId,
    );
  }

  @Patch('organization/:organizationId/inventory/:inventoryId/items/:itemId')
  @ApiOperation({ summary: 'Update information about an inventory item' })
  @ResponseMessage('Successfully updated inventory item')
  update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Param('itemId', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryItemService.update(
      organizationId,
      inventoryId,
      id,
      dto,
    );
  }
}
