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
        throw new BadRequestException('Only participants can send messages');
      }
    }

    if (conversation.type === ConversationType.INQUIRY) {
      if (
        conversation.initiator.id !== authorId &&
        conversation.handler?.id !== authorId
      ) {
        throw new BadRequestException(
          'Only initiator or handler can send messages',
        );
      }
    }

    const author = await this.userService.findById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const message = this.messageRepository.create({
      author,
      conversation,
      messageContent: content,
    });

    const savedMessage = await this.messageRepository.save(message);

    return savedMessage;
  }

  async updateMessage(messageId: number, updateMessageDto: UpdateMessageDto) {
    const { content, attachments } = updateMessageDto;

    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (!content && !attachments) {
      throw new BadRequestException(
        'Message content or attachments are required',
      );
    }

    if (content) {
      message.messageContent = content;
    }

    if (attachments) {
      // message.attachments = attachments;
    }

    return this.messageRepository.save(message);
  }

  async deleteMessage(messageId: number) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.messageRepository.delete(messageId);
  }
}
