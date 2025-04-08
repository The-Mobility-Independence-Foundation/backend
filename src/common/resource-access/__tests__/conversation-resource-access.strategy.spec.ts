import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResourceAccessStrategy } from '../strategies/conversation-resource-access.strategy';
import { createMock } from '@golevelup/ts-jest';
import { ResourceAccessStrategyRegistry } from '../interfaces/strategy-provider.interface';
import { STRATEGY_PROVIDERS_TOKEN } from '../interfaces/strategy-provider.interface';
import { ConversationsService } from '../../../conversations/conversations.service';
import { User, UserRole } from '../../../user/entities/user.entity';
import {
  Conversation,
  ConversationType,
} from '../../../conversations/entities/conversation.entity';
import { when } from 'jest-when';

describe('ConversationResourceAccessStrategy', () => {
  let strategy: ConversationResourceAccessStrategy;
  let conversationsService: ConversationsService;

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

    strategy = module.get(ConversationResourceAccessStrategy);
    conversationsService = module.get(ConversationsService);
  });

  describe('canAccess', () => {
    let user: User;
    let conversation: Conversation;

    beforeEach(() => {
      user = new User();
      conversation = new Conversation();
    });

    describe('direct conversations', () => {
      beforeEach(() => {
        Object.assign(conversation, {
          id: 1,
          type: ConversationType.DIRECT,
          participantId: 2,
          initiatorId: 1,
        });
      });

      it('should return true when user is participant', async () => {
        Object.assign(user, { id: 2 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(true);
      });

      it('should return true when user is initiator', async () => {
        Object.assign(user, { id: 1 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(true);
      });

      it('should return false when user is neither participant nor initiator', async () => {
        Object.assign(user, { id: 3 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
      });
    });

    describe('inquiry conversations', () => {
      beforeEach(() => {
        Object.assign(conversation, {
          id: 1,
          type: ConversationType.INQUIRY,
          participantId: 2,
          initiatorId: 1,
          listing: { organizationId: 3 },
        });
      });

      it('should return true when user is from listing owner organization', async () => {
        Object.assign(user, { id: 4, organizationId: 3 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(true);
      });

      it('should return true when user is initiator', async () => {
        Object.assign(user, { id: 1, organizationId: 4 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(true);
      });

      it('should return true when user is participant', async () => {
        Object.assign(user, { id: 2, organizationId: 4 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(true);
      });

      it('should return false when user is neither from owner org nor participant nor initiator', async () => {
        Object.assign(user, { id: 5, organizationId: 4 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
      });
    });

    describe('other cases', () => {
      it('should return false when conversation id is not a number', async () => {
        Object.assign(user, { id: 1 });

        const params = { conversationId: 'not-a-number' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
        expect(conversationsService.findById).not.toHaveBeenCalled();
      });

      it('should return false when conversation id is missing', async () => {
        Object.assign(user, { id: 1 });

        const params = {};

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
        expect(conversationsService.findById).not.toHaveBeenCalled();
      });

      it('should return false when user is a guest', async () => {
        Object.assign(user, { id: 1, type: UserRole.GUEST });

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
        expect(conversationsService.findById).not.toHaveBeenCalled();
      });

      it('should return false when conversation does not exist', async () => {
        Object.assign(user, { id: 1 });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(null);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
      });

      it('should return false when user has no organization id in inquiry conversation', async () => {
        Object.assign(user, { id: 1 });
        Object.assign(conversation, {
          id: 1,
          type: ConversationType.INQUIRY,
          listing: { organizationId: 3 },
        });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
      });

      it('should return false when listing is missing in inquiry conversation', async () => {
        Object.assign(user, { id: 1, organizationId: 3 });
        Object.assign(conversation, {
          id: 1,
          type: ConversationType.INQUIRY,
        });

        when(conversationsService.findById)
          .calledWith(1, { relations: { listing: true } })
          .mockResolvedValue(conversation);

        const params = { conversationId: '1' };

        const result = await strategy.canAccess(user, params);

        expect(result).toBe(false);
      });
    });
  });

  describe('getForbiddenMessage', () => {
    it('should return the default forbidden message', () => {
      const message = strategy.getForbiddenMessage();
      expect(message).toBe(
        'You do not have permission to access this resource',
      );
    });
  });
});
