import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { Organization } from '../organization/organization.entity';
import { Address } from '../address/address.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Organization, Address])],
  controllers: [InventoryController],
  providers: [InventoryService, PaginationService],
})
export class InventoryModule {}
