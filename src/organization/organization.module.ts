import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { Organization } from './organization.entity';
import { User } from 'src/user/user.entity';
import { Inventory } from 'src/inventory/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Inventory])],
  controllers: [OrganizationController],
  providers: [OrganizationService]
})
export class OrganizationModule {}
