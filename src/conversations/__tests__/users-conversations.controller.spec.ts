import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../conversations.service';
import { UsersConversationsController } from '../users-conversations.controller';
import { createMock } from '@golevelup/ts-jest';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { Conversation } from '../entities/conversation.entity';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';
import { when } from 'jest-when';
import {
  ResourceAccessStrategyRegistry,
  ResourceAccessStrategyToken,
  STRATEGY_PROVIDERS_TOKEN,
} from '../../common/resource-access/interfaces/strategy-provider.interface';
import { InitiateConversationDto } from '../dto/initiate-conversation.dto';
import { Reflector } from '@nestjs/core';
import { RESOURCE_ACCESS } from '../../common/resource-access/decorators/resource-access.decorator';
import { BadRequestException } from '@nestjs/common';

describe('UsersConversationsController', () => {
  let controller: UsersConversationsController;
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersConversationsController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(UsersConversationsController);
    service = module.get(ConversationsService);
  });

  describe('resource access strategy', () => {
    it('should use the USER resource access strategy', () => {
      const reflector = new Reflector();

      const strategy = reflector.get(
        RESOURCE_ACCESS,
        UsersConversationsController,
      );

      expect(strategy).toEqual({
        strategy: { providerToken: ResourceAccessStrategyToken.USER },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated conversations for a user', async () => {
      const userId = 1;
      const paginationDto = new CursorPaginationDto();
      const expectedResponse =
        new BaseApiCursorPaginationResponse<Conversation>();
      Object.assign(expectedResponse, {
        results: [new Conversation(), new Conversation()],
        nextCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
      });

      when(service.findAll)
        .calledWith(userId, paginationDto)
        .mockResolvedValue(expectedResponse);

      const conversations = await controller.findAll(userId, paginationDto);
      expect(conversations).toEqual(expectedResponse);
    });
  });

  describe('initiate', () => {
    it('should initiate a direct conversation', async () => {
      const userId = 1;
      const initiateConversationDto = new InitiateConversationDto();
      initiateConversationDto.participantId = 2;
      const conversation = new Conversation();

      when(service.initiateDirectConversation)
        .calledWith(userId, initiateConversationDto.participantId)
        .mockResolvedValue(conversation);

      const result = await controller.initiate(userId, initiateConversationDto);
      expect(result).toEqual(conversation);
    });

    it('should initiate a listing conversation', async () => {
      const userId = 1;
      const initiateConversationDto = new InitiateConversationDto();
      initiateConversationDto.listingId = 2;
      const conversation = new Conversation();

      when(service.initiateListingConversation)
        .calledWith(userId, initiateConversationDto.listingId)
        .mockResolvedValue(conversation);

      const result = await controller.initiate(userId, initiateConversationDto);
      expect(result).toEqual(conversation);
    });

    it('should throw BadRequestException if both participantId and listingId are provided', async () => {
      const userId = 1;
      const initiateConversationDto = new InitiateConversationDto();
      initiateConversationDto.participantId = 2;
      initiateConversationDto.listingId = 3;

      await expect(
        controller.initiate(userId, initiateConversationDto),
      ).rejects.toThrow(
        new BadRequestException(
          'Both participantId and listingId cannot be provided',
        ),
      );
    });

    it('should throw BadRequestException if neither participantId nor listingId is provided', async () => {
      const userId = 1;
      const initiateConversationDto = new InitiateConversationDto();

      await expect(
        controller.initiate(userId, initiateConversationDto),
      ).rejects.toThrow(
        new BadRequestException(
          'Either participantId or listingId needs to be provided',
        ),
      );
    });
  });
});
