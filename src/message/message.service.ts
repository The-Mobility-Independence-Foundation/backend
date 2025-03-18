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

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private conversationService: ConversationsService,
    private paginationService: PaginationService,
    private userService: UserService,
  ) {}

  /**
   * Find all messages for a conversation
   * @param conversationId - The id of the conversation
   * @param paginationDto - The pagination dto
   * @returns The paginated messages
   */
  async findAll(conversationId: number, paginationDto: CursorPaginationDto) {
    return this.paginationService.paginateWithCursor(
      this.messageRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: { conversationId },
      },
    );
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

    if (!content && !attachments) {
      throw new BadRequestException(
        'Message content or attachments are required',
      );
    }

    const author = await this.userService.findById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const conversation =
      await this.conversationService.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type === ConversationType.DIRECT) {
      if (
        conversation.initiator.id !== authorId &&
        conversation.participant?.id !== authorId
      ) {
        throw new BadRequestException(
          'You are not a participant of this conversation',
        );
      }
    }

    if (conversation.type === ConversationType.INQUIRY) {
      if (
        conversation.initiator.id !== authorId &&
        conversation.handler?.id !== authorId
      ) {
        throw new BadRequestException(
          'You are not a participant of this conversation',
        );
      }
    }

    const message = this.messageRepository.create({
      author,
      conversation,
      messageContent: content,
    });

    const savedMessage = await this.messageRepository.save(message);

    return savedMessage;
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

    if (!content && !attachments) {
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
        message.conversation.handler?.id !== authorId
      ) {
        throw new BadRequestException(
          'You are not a participant of this conversation',
        );
      }
    }

    if (content) {
      message.messageContent = content;
    }

    if (attachments) {
      // message.attachments = attachments;
    }

    return this.messageRepository.save(message);
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
        message.conversation.handler?.id !== userId
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
