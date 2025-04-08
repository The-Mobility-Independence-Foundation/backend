import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';

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
    return this.conversationsService.enterListingConversation(
      user.id,
      conversationId,
    );
  }

  @Post(':conversationId/leave')
  @ResponseMessage('Successfully left conversation')
  @ApiOperation({ summary: 'Leave a conversation' })
  async leaveConversation(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    const user = req.user as User;
    return this.conversationsService.leaveListingConversation(
      user.id,
      conversationId,
    );
  }

  @Delete(':conversationId/participants/:participantId')
  @ResponseMessage('Successfully removed participant from conversation')
  @ApiOperation({ summary: 'Remove a participant from a conversation' })
  async removeParticipantFromConversation(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Param('participantId', ParseIntPipe) participantId: number,
  ) {
    const user = req.user as User;
    return this.conversationsService.removeParticipantFromListingConversation(
      user.id,
      participantId,
      conversationId,
    );
  }
}
