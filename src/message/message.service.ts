import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    async create() {
        const message = new Message();
        message.senderID = 1;
        message.conversationID = 1;
        message.messageContent = "This message is content!"

        return this.messageRepository.save(message);
    }

    async findAll() {
        
        return this.messageRepository.find();
        
    }

    async findOne(id: number) {

        return this.messageRepository.findOneBy({messageID: id});

    }

}
