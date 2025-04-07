import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItem } from './inventory-item.entity';
import { InventoryItemService } from './inventory-item.service';
import { GetInventoryItemsDto } from './dto/get-inventory-item.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';

@ApiTags('inventoryItem')
@UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_MEMBER)
@Controller('organizations/:orgId/inventories/:inventoryId/items')
export class InventoryItemController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  /**
   * Create a new inventory item
   * @param dto : All necessary information to create a new item
   * @returns : A message of successful creation
   */
  @Post('')
  @ApiOperation({ summary: 'Initiate creation of an inventory item' })
  @ResponseMessage('Successfully created inventory item')
  @UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_MEMBER, {
    adminOnly: false,
  })
  create(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Body() dto: CreateInventoryItemDto,
  ): Promise<InventoryItem> {
    return this.inventoryItemService.create(inventoryId, dto);
  }

  /**
   * Find all items in an organizations inventory
   * @param orgId : The ID of the organization
   * @param inventoryId : The ID of the specific inventory
   * @returns : A list of items stored within that inventory
   */
  @Get('')
  @ApiOperation({ summary: 'Retrieve all items in a specific inventory' })
  @ResponseMessage('Successfully found all inventory item')
  findAll(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Query() query: GetInventoryItemsDto,
  ): Promise<BaseApiCursorPaginationResponse<InventoryItem>> {
    return this.inventoryItemService.findAll(orgId, inventoryId, query);
  }

  /**
   * Find a specifc iventory item
   * @param orgId : The ID of the organization
   * @param inventoryId : The ID of the inventory
   * @param itemId : The ID of the inventory item
   * @returns : The data of the item
   */
  @Get(':itemId')
  @ApiOperation({ summary: 'Retrieve a specific item in a specific inventory' })
  @ResponseMessage('Successfully found a specific inventory item')
  findOne(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<InventoryItem | null> {
    return this.inventoryItemService.findWithOrgInv(orgId, inventoryId, itemId);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Update information about an inventory item' })
  @ResponseMessage('Successfully updated inventory item')
  @UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_MEMBER, {
    adminOnly: false,
  })
  update(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Param('itemId', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryItemService.update(orgId, inventoryId, id, dto);
  }
}
