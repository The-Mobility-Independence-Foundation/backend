import { Controller, Post, Get, Param } from '@nestjs/common';
import { InventoryItem } from './inventory-item.entity';
import { InventoryItemService } from './inventory-item.service';

@Controller('inventoryItem')
export class InventoryItemController {

    constructor(private inventoryItemService: InventoryItemService) {}
    
    @Post()
    create(): Promise<InventoryItem> {
        return this.inventoryItemService.create();
    }

    @Get()
    findAll(): Promise<InventoryItem[]> {
        return this.inventoryItemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<InventoryItem | null> {
        return this.inventoryItemService.findOne(id);
    }

}
