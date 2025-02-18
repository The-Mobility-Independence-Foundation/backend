import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { Organization } from './organization.entity';
import { User } from '../user/user.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Address } from '../address/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Inventory, Address])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
