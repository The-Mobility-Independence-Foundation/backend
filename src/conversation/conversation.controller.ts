import { Controller, Post, Get, Param } from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(): Promise<Conversation> {
    return this.conversationService.create();
  }

  @Get()
  findAll(): Promise<Conversation[]> {
    return this.conversationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Conversation | null> {
    return this.conversationService.findOne(id);
  }
}
