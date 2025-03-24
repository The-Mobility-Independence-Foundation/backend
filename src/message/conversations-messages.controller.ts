import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Patch,
  Body,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';

@ApiTags('conversations')
@Controller('conversations/:conversationId/messages')
@UseStrategy(ResourceAccessStrategyToken.CONVERSATION)
export class ConversationsMessagesController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ResponseMessage('Successfully retrieved messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  async findAll(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query() paginationDto: CursorPaginationDto,
  ) {
    return this.messageService.findAll(conversationId, paginationDto);
  }

  @Post()
  @ResponseMessage('Successfully sent a message')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  async sendMessage(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const user = req.user as User;
    return this.messageService.sendMessage(
      user.id,
      conversationId,
      sendMessageDto,
    );
  }

  @Patch(':messageId')
  @ResponseMessage('Successfully updated a message')
  @ApiOperation({ summary: 'Update a message' })
  async updateMessage(
    @Req() req: Request,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    const user = req.user as User;
    return this.messageService.updateMessage(
      user.id,
      messageId,
      updateMessageDto,
    );
  }

  @Delete(':messageId')
  @ResponseMessage('Successfully deleted a message')
  @ApiOperation({ summary: 'Delete a message' })
  async deleteMessage(
    @Req() req: Request,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    const user = req.user as User;
    return this.messageService.deleteMessage(user.id, messageId);
  }
}
