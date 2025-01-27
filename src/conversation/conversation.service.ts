import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from '../listing/listing.entity';

@Injectable()
export class ConversationService {

    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,

        @InjectRepository(Listing)
        private readonly listingRepository: Repository<Listing>,
    ) {}

    async create() {
        const conversation = new Conversation();
        const listing = await this.listingRepository.findOneBy({ id: 1 });
        
        conversation.participant1 = 1;
        conversation.participant2 = 2;
        conversation.listing = listing;

        return this.conversationRepository.save(conversation);
    }

    async findAll() {
        
        return this.conversationRepository.find();
        
    }

    async findOne(id: number) {

        return this.conversationRepository.findOneBy({id: id});

    }

}
