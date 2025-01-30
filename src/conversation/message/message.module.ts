import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { User } from '../../user/user.entity';
import { Conversation } from '../../conversation/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Conversation])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
