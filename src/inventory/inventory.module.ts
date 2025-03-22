import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { Organization } from '../organization/organization.entity';
import { Address } from '../address/address.entity';
import { PaginationService } from '../common/services/pagination.service';
import { OrganizationService } from '../organization/organization.service';
import { AddressService } from '../address/address.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Organization, Address, User])],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    PaginationService,
    OrganizationService,
    AddressService,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
