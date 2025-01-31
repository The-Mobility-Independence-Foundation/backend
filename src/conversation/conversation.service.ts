import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from '../listing/listing.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create() {
    const conversation = new Conversation();
    const listing = await this.listingRepository.findOneBy({ id: 1 });
    const user1 = await this.userRepository.findOneBy({ id: 1 });
    const user2 = await this.userRepository.findOneBy({ id: 2 });

    if (user1) {
      conversation.participant1 = user1;
    }
    if (user2) {
      conversation.participant2 = user2;
    }
    if (listing) {
      conversation.listing = listing;
    }

    return this.conversationRepository.save(conversation);
  }

  async findAll() {
    return this.conversationRepository.find();
  }

  async findOne(id: number) {
    return this.conversationRepository.findOneBy({ id: id });
  }
}
