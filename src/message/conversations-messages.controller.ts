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
import { ResourceAccess } from '../common/resource-access/decorators/resource-access.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';

@ApiTags('conversations')
@Controller('conversations/:conversationId/messages')
@ResourceAccess()
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
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.updateMessage(messageId, updateMessageDto);
  }

  @Delete(':messageId')
  @ResponseMessage('Successfully deleted a message')
  @ApiOperation({ summary: 'Delete a message' })
  async deleteMessage(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return this.messageService.deleteMessage(messageId);
  }
}
