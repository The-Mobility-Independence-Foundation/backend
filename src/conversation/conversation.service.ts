import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConversationService {

    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
    ) {}

    async create() {
        const conversation = new Conversation();
        conversation.participant1 = 1;
        conversation.participant2 = 2;

        return this.conversationRepository.save(conversation);
    }

    async findAll() {
        
        return this.conversationRepository.find();
        
    }

    async findOne(id: number) {

        return this.conversationRepository.findOneBy({id: id});

    }

}
