import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Conversation } from '../conversations/entities/conversation.entity';

interface CreateMessageDto {
  conversationId: number;
  authorId: number;
  content: string;
}

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async create(conversationId: number, authorId: number, content: string) {
    const message = new Message();
    const sender = await this.userRepository.findOneBy({ id: authorId });
    const conversation = await this.conversationRepository.findOneBy({
      id: conversationId,
    });

    if (!sender || !conversation) {
      throw new Error('Sender or conversation not found');
    }

    message.author = sender;
    message.conversation = conversation;
    message.content = content;

    const savedMessage = await this.messageRepository.save(message);

    return savedMessage;
  }

  async findAll(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['author'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['author', 'conversation'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async markAsRead(messageId: number): Promise<Message> {
    const message = await this.findOne(messageId);
    message.readStatus = new Date();
    return this.messageRepository.save(message);
  }
}
