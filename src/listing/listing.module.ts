import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { Listing } from './listing.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { Organization } from '../organization/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Organization, InventoryItem])],
  controllers: [ListingController],
  providers: [ListingService],
})
export class ListingModule {}
