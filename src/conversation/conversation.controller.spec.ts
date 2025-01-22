import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from '../listing/listing.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ConversationController', () => {
  let controller: ConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
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

    controller = module.get<ConversationController>(ConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
