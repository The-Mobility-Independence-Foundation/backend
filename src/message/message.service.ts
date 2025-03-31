import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Message } from './message.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { UserService } from '../user/user.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AttachmentsService } from '../attachments/attachments.service';
import {
  Attachment,
  AttachmentEntityType,
} from '../attachments/attachment.entity';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { MessageResponse } from './respones/message.response';
import { SendMessageResponse } from './respones/send-message.response';
import { UpdateMessageResponse } from './respones/update-message.response';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private conversationService: ConversationsService,
    private paginationService: PaginationService,
    private userService: UserService,
    private attachmentsService: AttachmentsService,
  ) {}

  /**
   * Find a message by id
   * @param id - The id of the message
   * @param options - Optional query options
   * @returns The message record
   */
  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Message, 'id'>>;
      relations: FindOptionsRelations<Message>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    return this.messageRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
    });
  }

  /**
   * Find a message by id or throw an error
   * @param id - The id of the message
   * @param options - Optional query options
   * @returns The message record
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Message, 'id'>>;
      relations: FindOptionsRelations<Message>;
    }> = {},
  ) {
    const message = await this.findById(id, options);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  /**
   * Find all messages for a conversation with their attachments
   * @param conversationId - The id of the conversation
   * @param paginationDto - The pagination dto
   * @returns The paginated messages
   */
  async findAll(
    conversationId: number,
    paginationDto: CursorPaginationDto,
  ): Promise<BaseApiCursorPaginationResponse<MessageResponse>> {
    const paginated = await this.paginationService.paginateWithCursor(
      this.messageRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        relations: { author: true },
        where: { conversationId },
        order: {
          createdAt: 'DESC',
        },
      },
    );

    const formattedMessages = await Promise.all(
      paginated.results.map(async (message) => {
        return {
          id: message.id,
          author: message.author,
          conversationId: message.conversationId,
          content: message.content,
          attachments: await this.attachmentsService.findByEntity(
            message.id,
            AttachmentEntityType.MESSAGE,
          ),
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        };
      }),
    );

    return {
      ...paginated,
      results: formattedMessages,
    };
  }

  /**
   * Send a message to a conversation
   * @param authorId - The id of the author
   * @param conversationId - The id of the conversation
   * @param sendMessageDto - The send message dto
   * @param attachments - The attachments of the message
   * @returns The message
   */
  async sendMessage(
    authorId: number,
    conversationId: number,
    sendMessageDto: SendMessageDto,
    attachments?: Express.Multer.File[],
  ): Promise<SendMessageResponse> {
    const { content } = sendMessageDto;

    if (!content && (!attachments || attachments.length === 0)) {
      throw new BadRequestException(
        'Message content or attachments are required',
      );
    }

    const conversation =
      await this.conversationService.findByIdOrThrow(conversationId);

    if (
      conversation.initiatorId !== authorId &&
      conversation.participantId !== authorId
    ) {
      throw new BadRequestException(
        'You are not a participant of this conversation',
      );
    }

    let message: Message | undefined;
    try {
      message = await this.messageRepository.save({
        authorId,
        conversationId,
        content,
      });

      let attachmentEntities: Attachment[] = [];
      if (attachments && attachments.length > 0) {
        attachmentEntities = await this.attachmentsService.uploadFiles(
          message.id,
          AttachmentEntityType.MESSAGE,
          attachments,
          authorId,
        );
      }

      return {
        ...message,
        attachments: attachmentEntities,
      };
    } catch (error) {
      if (message) {
        await this.messageRepository.delete(message.id);
      }

      throw new BadRequestException('Failed to send message', {
        cause: error,
      });
    }
  }

  /**
   * Update a message
   * @param userId - The id of the user
   * @param messageId - The id of the message
   * @param updateMessageDto - The update message dto
   * @returns The message
   */
  async updateMessage(
    userId: number,
    messageId: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<UpdateMessageResponse> {
    const { content } = updateMessageDto;

    if (!content) {
      throw new BadRequestException('Message content is required');
    }

    const message = await this.findByIdOrThrow(messageId, {
      relations: {
        conversation: true,
      },
    });

    if (message.authorId !== userId) {
      throw new BadRequestException('You are not the author of this message');
    }

    if (
      message.conversation.initiatorId !== userId &&
      message.conversation.participantId !== userId
    ) {
      throw new BadRequestException(
        'You are not a participant of this conversation',
      );
    }

    const updatedMessage = await this.messageRepository.save({
      ...message,
      content,
    });

    const attachments = await this.attachmentsService.findByEntity(
      updatedMessage.id,
      AttachmentEntityType.MESSAGE,
    );

    return {
      ...updatedMessage,
      attachments,
    };
  }

  /**
   * Delete a message
   * @param userId - The id of the user
   * @param messageId - The id of the message
   */
  async deleteMessage(userId: number, messageId: number): Promise<void> {
    const message = await this.findByIdOrThrow(messageId, {
      relations: {
        conversation: true,
      },
    });

    if (message.authorId !== userId) {
      throw new BadRequestException('You are not the author of this message');
    }

    if (
      message.conversation.initiatorId !== userId &&
      message.conversation.participantId !== userId
    ) {
      throw new BadRequestException(
        'You are not a participant of this conversation',
      );
    }

    await this.attachmentsService.softDeleteByEntity(
      messageId,
      AttachmentEntityType.MESSAGE,
    );

    await this.messageRepository.softDelete(messageId);
  }
}
