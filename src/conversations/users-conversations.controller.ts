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
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { InitiateConversationDto } from './dto/initiate-conversation.dto';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';

@ApiTags('users')
@Controller('users/:userId/conversations')
@UseStrategy(ResourceAccessStrategyToken.USER)
export class UsersConversationsController {
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
}
