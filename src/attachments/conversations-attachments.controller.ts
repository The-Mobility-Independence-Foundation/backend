import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UseStrategy } from 'src/common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from 'src/common/resource-access/interfaces/strategy-provider.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FileUpload } from '../common/decorators/file-upload.decorator';
import { FilesValidationPipe } from '../common/pipes/files-validation.pipe';
import { User } from '../user/entities/user.entity';
import { AttachmentEntityType } from './attachment.entity';
import { AttachmentsService } from './attachments.service';

@ApiTags('conversations')
@Controller('conversations')
@UseStrategy(ResourceAccessStrategyToken.USER_ME)
export class ConversationsAttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':conversationId/attachments')
  @FileUpload()
  @ApiOperation({ summary: 'Upload attachments to a conversation' })
  @ResponseMessage('Attachments uploaded successfully')
  async uploadAttachments(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @UploadedFiles(new FilesValidationPipe()) files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    return this.attachmentsService.uploadFiles(
      conversationId,
      AttachmentEntityType.MESSAGE,
      files,
      user.id,
    );
  }
}
