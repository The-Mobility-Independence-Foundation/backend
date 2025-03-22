import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './inventory-item.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Manufacturer, Model } from '../model/model.entity';
import { Part } from '../part/part.entity';
import { PaginationService } from '../common/services/pagination.service';
import { PartService } from '../part/part.service';
import { ModelService } from '../model/model.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryItem,
      Inventory,
      Model,
      Part,
      Manufacturer,
    ]),
  ],
  controllers: [InventoryItemController],
  providers: [
    InventoryItemService,
    PaginationService,
    PartService,
    ModelService,
  ],
})
export class InventoryItemModule {}
