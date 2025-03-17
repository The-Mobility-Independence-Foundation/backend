import {
  Controller,
  Get,
  Query,
  Param,
  BadRequestException,
  Body,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceAccess } from '../auth/decorators/resource-access.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { InitiateConversationDto } from './dto/initiate-conversation.dto';

@ResourceAccess()
@ApiTags('users')
@Controller('users/:userId/conversations')
export class UserConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved conversations')
  @ApiOperation({ summary: 'Get conversations for the current user' })
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: CursorPaginationDto,
  ) {
    return this.conversationsService.findAll(userId, paginationDto);
  }
  @Post()
  @ResponseMessage('Successfully initiated a new conversation')
  @ApiOperation({ summary: 'Initiate a new conversation' })
  async initiate(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() initiateConversationDto: InitiateConversationDto,
  ) {
    const { participantId, listingId } = initiateConversationDto;

    if ((participantId && listingId) || (!participantId && !listingId)) {
      throw new BadRequestException(
        'Either participantId or listingId needs to be provided, but not both',
      );
    }

    if (participantId) {
      return this.conversationsService.initiateDirectConversation(
        userId,
        participantId,
      );
    } else if (listingId) {
      return this.conversationsService.initiateListingConversation(
        userId,
        listingId,
      );
    }
  }

  @Get(':conversationId')
  @ResponseMessage('Successfully retrieved conversation')
  @ApiOperation({ summary: 'Get a specific conversation by ID' })
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.conversationsService.findById(conversationId);
  }

  @Post(':conversationId/enter')
  @ResponseMessage('Successfully entered conversation')
  @ApiOperation({ summary: 'Enter a conversation' })
  async enterConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.conversationsService.enterConversation(userId, conversationId);
  }

  @Post(':conversationId/leave')
  @ResponseMessage('Successfully left conversation')
  @ApiOperation({ summary: 'Leave a conversation' })
  async leaveConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.conversationsService.leaveConversation(userId, conversationId);
  }
}
