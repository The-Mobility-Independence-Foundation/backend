import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { ListingModule } from '../listing/listing.module';
import { AddressModule } from '../address/address.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => UserModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => ListingModule),
    AddressModule,
    CommonModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
