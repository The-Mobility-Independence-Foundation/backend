import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './inventory-item.entity';
import { Manufacturer } from '../model/model.entity';
import { ModelModule } from '../model/model.module';
import { PartModule } from '../part/part.module';
import { TagModule } from '../tag/tag.module';
import { CommonModule } from '../common/common.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, Manufacturer]),
    ModelModule,
    PartModule,
    TagModule,
    CommonModule,
    InventoryModule,
  ],
  controllers: [InventoryItemController],
  providers: [InventoryItemService],
  exports: [InventoryItemService],
})
export class InventoryItemModule {}
