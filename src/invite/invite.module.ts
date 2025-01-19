import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invite])],
  controllers: [InviteController],
  providers: [InviteService]
})
export class InviteModule {}
