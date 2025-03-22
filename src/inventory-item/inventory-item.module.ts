import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './inventory-item.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Manufacturer } from '../model/model.entity';
import { ModelModule } from '../model/model.module';
import { PartModule } from '../part/part.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, Inventory, Manufacturer]),
    ModelModule,
    PartModule,
    TagModule,
  ],
  controllers: [InventoryItemController],
  providers: [InventoryItemService],
})
export class InventoryItemModule {}
