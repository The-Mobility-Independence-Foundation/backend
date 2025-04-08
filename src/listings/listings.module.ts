import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { Listing } from './listing.entity';
import { InventoryItemModule } from '../inventory-item/inventory-item.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    InventoryItemModule,
    TypeOrmModule.forFeature([Listing]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
