import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Conversation } from '../../conversation/conversation.entity';

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

  async create() {
    const message = new Message();
    const sender = await this.userRepository.findOneBy({ id: 1 });
    const conversation = await this.conversationRepository.findOneBy({ id: 1 });

    if (sender) {
      message.sender = sender;
    }
    if (conversation) {
      message.conversation = conversation;
    }

    message.messageContent = 'This message is content!';

    return this.messageRepository.save(message);
  }

  async findAll() {
    return this.messageRepository.find();
  }

  async findOne(id: number) {
    return this.messageRepository.findOneBy({ id: id });
  }
}
