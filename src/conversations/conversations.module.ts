import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { UsersConversationsController } from './users-conversations.controller';
import { ConversationsService } from './conversations.service';
import { ListingModule } from 'src/listing/listing.module';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/common/common.module';
import { ConversationHandlerHistory } from './entities/conversation-handler-history.entity';
import { ConversationsController } from './conversations.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationHandlerHistory]),
    ListingModule,
    UserModule,
    CommonModule,
  ],
  controllers: [UsersConversationsController, ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
