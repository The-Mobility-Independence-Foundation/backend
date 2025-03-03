import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { Listing } from '../listing/listing.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Listing, User])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
