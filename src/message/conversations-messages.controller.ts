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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { MessageResponse } from './respones/message.response';
import { SendMessageResponse } from './respones/send-message.response';
import { UpdateMessageResponse } from './respones/update-message.response';

@ApiTags('conversations')
@Controller('conversations/:conversationId/messages')
@UseStrategy(ResourceAccessStrategyToken.CONVERSATION)
export class ConversationsMessagesController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved messages',
    type: BaseApiCursorPaginationResponse,
  })
  @ResponseMessage('Successfully retrieved messages')
  async findAll(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query() paginationDto: CursorPaginationDto,
  ): Promise<BaseApiCursorPaginationResponse<MessageResponse>> {
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
  @ApiResponse({
    status: 200,
    description: 'Successfully sent a message',
    type: MessageResponse,
  })
  @ResponseMessage('Successfully sent a message')
  async sendMessage(
    @CurrentUser() user: User,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() sendMessageDto: SendMessageDto,
    @UploadedFiles(new FilesValidationPipe({ fileIsRequired: false }))
    files: Express.Multer.File[],
  ): Promise<SendMessageResponse> {
    return this.messageService.sendMessage(
      user.id,
      conversationId,
      sendMessageDto,
      files,
    );
  }

  @Patch(':messageId')
  @ApiOperation({ summary: 'Update a message' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated a message',
    type: MessageResponse,
  })
  @ResponseMessage('Successfully updated a message')
  async updateMessage(
    @CurrentUser() user: User,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<UpdateMessageResponse> {
    return this.messageService.updateMessage(
      user.id,
      messageId,
      updateMessageDto,
    );
  }

  @Delete(':messageId')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted a message',
  })
  @ResponseMessage('Successfully deleted a message')
  async deleteMessage(
    @CurrentUser() user: User,
    @Param('messageId', ParseIntPipe) messageId: number,
  ): Promise<void> {
    return this.messageService.deleteMessage(user.id, messageId);
  }
}
