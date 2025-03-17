import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../conversations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Listing } from '../../listing/listing.entity';
import { User } from '../../user/entities/user.entity';
import { ConversationHandlerHistory } from '../entities/conversation-handler-history.entity';
import { createMock } from '@golevelup/ts-jest';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ConversationsService', () => {
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(Conversation),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(ConversationHandlerHistory),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Listing),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
