import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { User } from '../user/entities/user.entity';
import { Conversation } from '../conversation/conversation.entity';
import { AttachmentsModule } from '../attachments/attachments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Conversation]),
    AttachmentsModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
