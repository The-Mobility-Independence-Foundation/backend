import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';

@Controller('inventory')
export class InventoryController {
    constructor(private inventoryService: InventoryService) {}

    @Post()
    create(): Promise<Inventory> {
        return this.inventoryService.create();
    }

    @Get()
    findAll(): Promise<Inventory[]> {
        return this.inventoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Inventory | null> {
        return this.inventoryService.findOne(id);
    }
}
