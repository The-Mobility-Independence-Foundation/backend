import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Organization } from '../organization/organization.entity';
import { UserAuth } from './entities/user-auth.entity';
import { UserAuthService } from './user-auth.service';
import { CommonModule } from '../common/common.module';
import { ListingsModule } from '../listings/listings.module';
import { BookmarkModule } from '../bookmarks/bookmarks.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization, UserAuth]),
    CommonModule,
    ListingsModule,
    forwardRef(() => BookmarkModule),
    forwardRef(() => OrderModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserAuthService],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
