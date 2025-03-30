import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { ConversationType } from '../conversations/entities/conversation.entity';
import { UserService } from '../user/user.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AttachmentsService } from '../attachments/attachments.service';
import { AttachmentEntityType } from '../attachments/attachment.entity';
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
   * Find all messages for a conversation with their attachments
   * @param conversationId - The id of the conversation
   * @param paginationDto - The pagination dto
   * @returns The paginated messages
   */
  async findAll(conversationId: number, paginationDto: CursorPaginationDto) {
    const paginated = await this.paginationService.paginateWithCursor(
      this.messageRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: { conversationId },
        order: {
          createdAt: 'DESC',
        },
      },
    );

    return paginated;
    // const formattedMessages = await Promise.all(
    //   paginated.results.map(async (message) => {
    //     return {
    //       ...message,
    //       attachments: await this.attachmentsService.findByTypeAndId(
    //         AttachmentEntityType.MESSAGE,
    //         message.id,
    //       ),
    //     };
    //   }),
    // );

    // return {
    //   ...paginated,
    //   results: formattedMessages,
    // };
  }

  /**
   * Send a message to a conversation
   * @param authorId - The id of the author
   * @param conversationId - The id of the conversation
   * @param sendMessageDto - The send message dto
   * @returns The message
   */
  async sendMessage(
    authorId: number,
    conversationId: number,
    sendMessageDto: SendMessageDto,
  ) {
    const { content, attachments } = sendMessageDto;

    if (!content && (!attachments || attachments.length === 0)) {
      throw new BadRequestException(
        'Message content or attachments are required',
      );
    }

    const conversation =
      await this.conversationService.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (
      conversation.initiator.id !== authorId &&
      conversation.participant?.id !== authorId
    ) {
      throw new BadRequestException(
        'You are not a participant of this conversation',
      );
    }

    const message = this.messageRepository.create({
      authorId,
      conversationId,
      messageContent: content,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Upload attachments if provided
    if (attachments && attachments.length > 0) {
      await this.attachmentsService.uploadFiles(
        savedMessage.id,
        AttachmentEntityType.MESSAGE,
        attachments,
        authorId,
      );
    }

    return {
      ...savedMessage,
      hasAttachments: attachments && attachments.length > 0,
    };
  }

  /**
   * Update a message
   * @param authorId - The id of the author
   * @param messageId - The id of the message
   * @param updateMessageDto - The update message dto
   * @returns The message
   */
  async updateMessage(
    authorId: number,
    messageId: number,
    updateMessageDto: UpdateMessageDto,
  ) {
    const { content, attachments } = updateMessageDto;

    if (!content && (!attachments || attachments.length === 0)) {
      throw new BadRequestException(
        'Message content or attachments are required',
      );
    }

    const author = await this.userService.findById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.author.id !== authorId) {
      throw new BadRequestException('You are not the author of this message');
    }

    if (message.conversation.type === ConversationType.DIRECT) {
      if (
        message.conversation.initiator.id !== authorId &&
        message.conversation.participant?.id !== authorId
      ) {
        throw new BadRequestException(
          'You are not a participant of this conversation',
        );
      }
    }

    if (message.conversation.type === ConversationType.INQUIRY) {
      if (
        message.conversation.initiator.id !== authorId &&
        message.conversation.participant?.id !== authorId
      ) {
        throw new BadRequestException(
          'You are not a participant of this conversation',
        );
      }
    }

    if (content) {
      message.messageContent = content;
    }

    const updatedMessage = await this.messageRepository.save(message);

    // Upload attachments if provided
    if (attachments && attachments.length > 0) {
      await this.attachmentsService.uploadFiles(
        updatedMessage.id,
        AttachmentEntityType.MESSAGE,
        attachments,
        authorId,
      );
    }

    return {
      ...updatedMessage,
      hasAttachments: attachments && attachments.length > 0,
    };
  }

  /**
   * Delete a message
   * @param userId - The id of the user
   * @param messageId - The id of the message
   * @returns The message
   */
  async deleteMessage(userId: number, messageId: number) {
    const author = await this.userService.findById(userId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.author.id !== userId) {
      throw new BadRequestException('You are not the author of this message');
    }

    if (message.conversation.type === ConversationType.DIRECT) {
      if (
        message.conversation.initiator.id !== userId &&
        message.conversation.participant?.id !== userId
      ) {
        throw new BadRequestException(
          'You are not a participant of this conversation',
        );
      }
    }

    if (message.conversation.type === ConversationType.INQUIRY) {
      if (
        message.conversation.initiator.id !== userId &&
        message.conversation.participant?.id !== userId
      ) {
        throw new BadRequestException(
          'You are not a participant of this conversation',
        );
      }
    }

    // TODO: Soft delete the message
    return this.messageRepository.delete(messageId);
  }
}
