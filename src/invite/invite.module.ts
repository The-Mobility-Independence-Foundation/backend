import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity';
import { User } from 'src/user/user.entity';
import { Organization } from 'src/organization/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invite, User, Organization])],
  controllers: [InviteController],
  providers: [InviteService]
})
export class InviteModule {}
