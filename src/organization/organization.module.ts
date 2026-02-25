import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { Organization } from './organization.entity';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { User } from '../user/entities/user.entity';
import { OrderModule } from '../order/order.module';
import { Order } from '../order/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User, Order]),
    UserModule,
    AddressModule,
    CommonModule,
    OrderModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
