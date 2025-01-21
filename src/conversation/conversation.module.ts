import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { Listing } from 'src/listing/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Listing])],
  controllers: [ConversationController],
  providers: [ConversationService]
})
export class ConversationModule {}