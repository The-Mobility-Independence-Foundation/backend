import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { Listing } from './listing.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { Organization } from '../organization/organization.entity';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, Organization, InventoryItem]),
    forwardRef(() => OrderModule),
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService],
})
export class ListingModule {}
