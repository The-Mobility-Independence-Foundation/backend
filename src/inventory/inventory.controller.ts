import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Initiate creation of an inventory'})
  create(@Body() dto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(dto);
  }

  @Get('organization/:organizationId/inventory/')
  @ApiOperation({summary: 'Retrieve an organizations inventories'})
  findAll(@Param('organizationId') organizationId: string,): Promise<Inventory[]> {
    return this.inventoryService.findAll(Number(organizationId));
  }

  @Get('organization/:organizationId/inventory/:id')
  @ApiOperation({ summary: 'Retrieve a specific inventory from an organization'})
  findOne(@Param('id') id: string, @Param('organizationId') organizationId: string): Promise<Inventory | null> {
    return this.inventoryService.findOne(Number(id), Number(organizationId));
  }

  @Patch('organization/:organizationId/inventory/:id')
  @ApiOperation({ summary: 'Update information about an inventory'})
  update(@Param('organizationId') organizationId: string, @Param('id') id: string, @Body() dto: UpdateInventoryDto){
    return this.inventoryService.update(Number(organizationId), Number(id), dto);
  }
}
