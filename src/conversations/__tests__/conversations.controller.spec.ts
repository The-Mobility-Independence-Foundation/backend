import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  STRATEGY_PROVIDERS_TOKEN,
  ResourceAccessStrategyRegistry,
  ResourceAccessStrategyToken,
} from '../../common/resource-access/interfaces/strategy-provider.interface';
import { ConversationsController } from '../conversations.controller';
import { RESOURCE_ACCESS } from '../../common/resource-access/decorators/resource-access.decorator';
import { Reflector } from '@nestjs/core';
import { Conversation } from '../entities/conversation.entity';
import { ConversationType } from '../entities/conversation.entity';
import { ConversationsService } from '../conversations.service';
import { when } from 'jest-when';
import { User } from '../../user/entities/user.entity';
import { Request } from 'express';

describe('ConversationsController', () => {
  let controller: ConversationsController;
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(ConversationsController);
    service = module.get(ConversationsService);
  });

  describe('resource access strategy', () => {
    it('should use the CONVERSATION resource access strategy', () => {
      const reflector = new Reflector();

      const strategy = reflector.get(RESOURCE_ACCESS, ConversationsController);

      expect(strategy).toEqual({
        strategy: { providerToken: ResourceAccessStrategyToken.CONVERSATION },
      });
    });
  });

  describe('findOne', () => {
    it('should return a conversation by id', async () => {
      const conversation = new Conversation();
      Object.assign(conversation, {
        id: 1,
        type: ConversationType.DIRECT,
      });

      when(service.findById).calledWith(1).mockResolvedValue(conversation);

      const result = await controller.findOne(1);

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('enterConversation', () => {
    it('should allow a user to enter a conversation', async () => {
      const userId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      const user = new User();
      Object.assign(user, {
        id: userId,
      });

      const req = createMock<Request>({ user });

      when(service.enterListingConversation)
        .calledWith(userId, conversationId)
        .mockResolvedValue(conversation);

      const result = await controller.enterConversation(req, conversationId);

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
      expect(service.enterListingConversation).toHaveBeenCalledWith(
        userId,
        conversationId,
      );
    });
  });

  describe('leaveConversation', () => {
    it('should allow a user to leave a conversation', async () => {
      const userId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      const user = new User();
      Object.assign(user, {
        id: userId,
      });

      const req = createMock<Request>({ user });

      when(service.leaveListingConversation)
        .calledWith(userId, conversationId)
        .mockResolvedValue(conversation);

      const result = await controller.leaveConversation(req, conversationId);

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
      expect(service.leaveListingConversation).toHaveBeenCalledWith(
        userId,
        conversationId,
      );
    });
  });

  describe('removeParticipantFromConversation', () => {
    it('should remove a participant from a conversation', async () => {
      const userId = 1;
      const conversationId = 2;
      const participantId = 3;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      const user = new User();
      Object.assign(user, {
        id: userId,
      });

      const req = createMock<Request>({ user });

      when(service.removeParticipantFromListingConversation)
        .calledWith(userId, participantId, conversationId)
        .mockResolvedValue(conversation);

      const result = await controller.removeParticipantFromConversation(
        req,
        conversationId,
        participantId,
      );

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
      expect(
        service.removeParticipantFromListingConversation,
      ).toHaveBeenCalledWith(userId, participantId, conversationId);
    });
  });
});
