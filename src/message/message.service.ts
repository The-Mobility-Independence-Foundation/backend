import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Conversation } from '../conversation/conversation.entity';

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

  async findAll() {
    return this.messageRepository.find();
  }

  async findOne(id: number) {
    return this.messageRepository.findOneBy({ id: id });
  }
}
