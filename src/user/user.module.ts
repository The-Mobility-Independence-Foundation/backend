import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Organization } from '../organization/organization.entity';
import { UserAuth } from './entities/user-auth.entity';
import { UserAuthService } from './user-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, UserAuth])],
  controllers: [UserController],
  providers: [UserService, UserAuthService],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
