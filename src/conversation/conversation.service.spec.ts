import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Listing } from '../listing/listing.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService, 
        {
          provide: getRepositoryToken(Conversation), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Listing), 
          useClass: mockRepository
        }
      ]
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
