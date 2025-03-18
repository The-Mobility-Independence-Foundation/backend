import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsMessagesController } from '../conversations-messages.controller';
import { MessageService } from '../message.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '../message.entity';
import { User } from '../../user/entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { createMock } from '@golevelup/ts-jest';
import { STRATEGY_PROVIDERS_TOKEN } from '../../common/resource-access/interfaces/strategy-provider.interface';
import { ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';
export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('MessageController', () => {
  let controller: ConversationsMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsMessagesController],
      providers: [
        MessageService,
        {
          provide: getRepositoryToken(Message),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Conversation),
          useClass: mockRepository,
        },
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<ConversationsMessagesController>(
      ConversationsMessagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
