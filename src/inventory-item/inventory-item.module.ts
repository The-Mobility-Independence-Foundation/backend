import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './inventory-item.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Model } from '../model/model.entity';
import { Part } from '../part/part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, Inventory, Model, Part])],
  controllers: [InventoryItemController],
  providers: [InventoryItemService],
})
export class InventoryItemModule {}
