import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/organization.entity';
import { Listing } from '../listing/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Organization, Listing])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
