import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { Listing } from './listing.entity';
import { InventoryItemModule } from '../inventory-item/inventory-item.module';
import { CommonModule } from '../common/common.module';
import { AttachmentsModule } from '../attachments/attachments.module';
import { AddressModule } from '../address/address.module';
import { OrganizationsListingsController } from './organizations-listings.controller';

@Module({
  imports: [
    CommonModule,
    AddressModule,
    forwardRef(() => InventoryItemModule),
    AttachmentsModule,
    TypeOrmModule.forFeature([Listing]),
  ],
  controllers: [ListingsController, OrganizationsListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
