import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './inventory-item.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Manufacturer } from '../model/model.entity';
import { ModelModule } from 'src/model/model.module';
import { PartModule } from 'src/part/part.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, Inventory, Manufacturer]),
    ModelModule,
    PartModule,
  ],
  controllers: [InventoryItemController],
  providers: [InventoryItemService],
})
export class InventoryItemModule {}
