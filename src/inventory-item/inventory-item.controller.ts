import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  //ParseIntPipe,
  //Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
//import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryItem } from './inventory-item.entity';
import { InventoryItemService } from './inventory-item.service';

@Controller('inventoryItem')
export class InventoryItemController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  @Post()
  @ApiOperation({ summary: 'Initiate creation of an inventory item' })
  @ApiResponse({
    status: 201,
    description: 'Inventory item successfully created',
  })
  create(@Body() dto: CreateInventoryItemDto): Promise<InventoryItem> {
    return this.inventoryItemService.create(dto);
  }

  @Get('organization/:organizationId/inventory/:inventoryId/items')
  @ApiOperation({ summary: 'Retrieve all items in a specific inventory' })
  findAll(): Promise<InventoryItem[]> {
    return this.inventoryItemService.findAll();
  }

  @Get('organization/:organizationId/inventory/:inventoryId/items/:itemId')
  @ApiOperation({ summary: 'Retrieve a specific item in a specific inventory' })
  findOne(@Param('id') id: number): Promise<InventoryItem | null> {
    return this.inventoryItemService.findOne(id);
  }

  /**
 * Add update functionality
 * 
  @Patch('organization/:organizationId/inventory/:inventoryId/items/:itemId')
  @ApiOperation({ summary: 'Update information about an inventory' })
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
  */
}
