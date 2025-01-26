import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './inventory-item.entity';
import { Inventory } from '../inventory.entity';
import { Model } from './model/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, Inventory, Model])],
  controllers: [InventoryItemController],
  providers: [InventoryItemService]
})
export class InventoryItemModule {}
