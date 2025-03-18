import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItem } from './inventory-item.entity';
import { InventoryItemService } from './inventory-item.service';

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
  @ApiResponse({
    status: 201,
    description: 'Inventory item successfully created',
  })
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
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
  ): Promise<InventoryItem[]> {
    return this.inventoryItemService.findAll(organizationId, inventoryId);
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
  findOne(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<InventoryItem | null> {
    return this.inventoryItemService.findOne(
      organizationId,
      inventoryId,
      itemId,
    );
  }

  @Patch('organization/:organizationId/inventory/:inventoryId/items/:itemId')
  @ApiOperation({ summary: 'Update information about an inventory item' })
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
