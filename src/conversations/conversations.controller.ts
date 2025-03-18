import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UseStrategy } from 'src/common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from 'src/common/resource-access/interfaces/strategy-provider.interface';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@ApiTags('conversations')
@Controller('conversations')
@UseStrategy(ResourceAccessStrategyToken.CONVERSATION)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(':conversationId')
  @ResponseMessage('Successfully retrieved conversation')
  @ApiOperation({ summary: 'Get a specific conversation by ID' })
  async findOne(@Param('conversationId', ParseIntPipe) conversationId: number) {
    return this.conversationsService.findById(conversationId);
  }

  @Post(':conversationId/enter')
  @ResponseMessage('Successfully entered conversation')
  @ApiOperation({ summary: 'Enter a conversation' })
  async enterConversation(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    const user = req.user as User;
    return this.conversationsService.enterConversation(user.id, conversationId);
  }

  @Post(':conversationId/leave')
  @ResponseMessage('Successfully left conversation')
  @ApiOperation({ summary: 'Leave a conversation' })
  async leaveConversation(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    const user = req.user as User;
    return this.conversationsService.leaveConversation(user.id, conversationId);
  }
}
