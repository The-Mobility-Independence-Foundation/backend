import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { Organization } from '../organization/organization.entity';
import { Address } from '../address/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Organization, Address])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
