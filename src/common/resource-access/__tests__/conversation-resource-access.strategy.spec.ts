import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResourceAccessStrategy } from '../strategies/conversation-resource-access.strategy';
import { createMock } from '@golevelup/ts-jest';
// import { ConversationsService } from '../../../conversations/conversations.service';
import { ResourceAccessStrategyRegistry } from '../interfaces/strategy-provider.interface';
import { STRATEGY_PROVIDERS_TOKEN } from '../interfaces/strategy-provider.interface';

describe('ConversationResourceAccessStrategy', () => {
  let strategy: ConversationResourceAccessStrategy;
  // let conversationsService: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResourceAccessStrategy,
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    strategy = module.get<ConversationResourceAccessStrategy>(
      ConversationResourceAccessStrategy,
    );
    // conversationsService =
    //   module.get<ConversationsService>(ConversationsService);
  });

  // describe('canAccess', () => {
  //   let user: User;
  //   let conversation: Conversation;

  //   beforeEach(() => {
  //     user = new User();
  //     conversation = new Conversation();
  //   });

  //   it('should return true when user is participant1', async () => {
  //     Object.assign(user, { id: 1 });
  //     Object.assign(conversation, {
  //       id: 1,
  //       participant1: user,
  //       participant2: { id: 2 } as User,
  //       messages: [],
  //       listing: null,
  //     });

  //     when(conversationsService.findOne)
  //       .calledWith(1)
  //       .mockResolvedValue(conversation);

  //     const params = { conversationId: '1' };

  //     const result = await strategy.canAccess(user, params);

  //     expect(result).toBe(true);
  //   });

  //   it('should return true when user is participant2', async () => {
  //     Object.assign(user, { id: 2 });
  //     Object.assign(conversation, {
  //       id: 1,
  //       participant1: { id: 1 } as User,
  //       participant2: user,
  //       messages: [],
  //       listing: null,
  //     });

  //     when(conversationService.findOne)
  //       .calledWith(1)
  //       .mockResolvedValue(conversation);

  //     const params = { conversationId: '1' };

  //     const result = await strategy.canAccess(user, params);

  //     expect(result).toBe(true);
  //   });

  //   it('should return false when user is not a participant', async () => {
  //     Object.assign(user, { id: 3 });
  //     Object.assign(conversation, {
  //       id: 1,
  //       participant1: { id: 1 } as User,
  //       participant2: { id: 2 } as User,
  //       messages: [],
  //       listing: null,
  //     });

  //     when(conversationService.findOne)
  //       .calledWith(1)
  //       .mockResolvedValue(conversation);

  //     const params = { conversationId: '1' };

  //     const result = await strategy.canAccess(user, params);

  //     expect(result).toBe(false);
  //   });

  //   it('should return false when conversation does not exist', async () => {
  //     Object.assign(user, { id: 1 });

  //     when(conversationService.findOne).calledWith(1).mockResolvedValue(null);

  //     const params = { conversationId: '1' };

  //     const result = await strategy.canAccess(user, params);

  //     expect(result).toBe(false);
  //   });

  //   it('should return false when conversationId param is not a number', async () => {
  //     Object.assign(user, { id: 1 });

  //     const params = { conversationId: 'not-a-number' };

  //     const result = await strategy.canAccess(user, params);

  //     expect(result).toBe(false);
  //     expect(conversationService.findOne).not.toHaveBeenCalled();
  //   });

  //   it('should return false when conversationId param is missing', async () => {
  //     Object.assign(user, { id: 1 });

  //     const params = {};

  //     const result = await strategy.canAccess(user, params);

  //     expect(result).toBe(false);
  //     expect(conversationService.findOne).not.toHaveBeenCalled();
  //   });
  // });

  describe('getForbiddenMessage', () => {
    it('should return the default forbidden message', () => {
      const message = strategy.getForbiddenMessage();
      expect(message).toBe(
        'You do not have permission to access this resource',
      );
    });
  });
});
