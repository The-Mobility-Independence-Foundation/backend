import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { UsersConversationsController } from './users-conversations.controller';
import { ConversationsService } from './conversations.service';
import { ListingModule } from '../listing/listing.module';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { ConversationHistory } from './entities/conversation-history.entity';
import { ConversationsController } from './conversations.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationHistory]),
    ListingModule,
    UserModule,
    CommonModule,
  ],
  controllers: [UsersConversationsController, ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
