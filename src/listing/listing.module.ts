import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { Listing } from './listing.entity';
import { User } from 'src/user/user.entity';
import { InventoryItem } from 'src/inventory-item/inventory-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, User, InventoryItem])],
  controllers: [ListingController],
  providers: [ListingService]
})
export class ListingModule {}
