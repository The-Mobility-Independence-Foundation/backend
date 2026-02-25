import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsMessagesController } from './conversations-messages.controller';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { CommonModule } from 'src/common/common.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { UserModule } from 'src/user/user.module';
import { AttachmentsModule } from 'src/attachments/attachments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    CommonModule,
    ConversationsModule,
    UserModule,
    AttachmentsModule,
  ],
  controllers: [ConversationsMessagesController],
  providers: [MessageService],
})
export class MessageModule {}
