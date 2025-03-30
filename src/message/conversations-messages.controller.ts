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
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';
import { User } from '../user/entities/user.entity';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { FileUpload } from '../common/decorators/file-upload.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FilesValidationPipe } from '../common/pipes/files-validation.pipe';

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
  @FileUpload({
    properties: {
      content: {
        type: 'string',
        description: 'The content of the message',
        example: 'Hello, how are you?',
      },
    },
  })
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ResponseMessage('Successfully sent a message')
  async sendMessage(
    @CurrentUser() user: User,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() sendMessageDto: SendMessageDto,
    @UploadedFiles(new FilesValidationPipe({ fileIsRequired: false }))
    files: Express.Multer.File[],
  ) {
    sendMessageDto.attachments = files;
    return this.messageService.sendMessage(
      user.id,
      conversationId,
      sendMessageDto,
    );
  }

  @Patch(':messageId')
  @FileUpload({
    properties: {
      content: {
        type: 'string',
        description: 'The updated content of the message',
        example: 'Updated message content',
      },
    },
  })
  @ApiOperation({ summary: 'Update a message' })
  @ResponseMessage('Successfully updated a message')
  async updateMessage(
    @CurrentUser() user: User,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @UploadedFiles(new FilesValidationPipe({ fileIsRequired: false }))
    files: Express.Multer.File[],
  ) {
    updateMessageDto.attachments = files;
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
    @CurrentUser() user: User,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return this.messageService.deleteMessage(user.id, messageId);
  }
}
