import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { getInventoryDto } from './dto/get-inventory.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(dto);
  }

  @Get('organization/:organizationId/Inventory/')
  findAll(@Param('organizationId') organizationId: string): Promise<Inventory[]> {
    return this.inventoryService.findAll(Number(organizationId));
  }

  @Get('organization/:organizationId/inventory/:id')
  findOne(@Param('id') id: string,@Param('organizationId') organizationId: string): Promise<Inventory | null> {
    return this.inventoryService.findOne(Number(id), Number(organizationId));
  }
}
