import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { ConversationsMessagesController } from '../conversations-messages.controller';
import { MessageService } from '../message.service';
import { createMock } from '@golevelup/ts-jest';
import {
  ResourceAccessStrategyRegistry,
  ResourceAccessStrategyToken,
  STRATEGY_PROVIDERS_TOKEN,
} from '../../common/resource-access/interfaces/strategy-provider.interface';
import { Reflector } from '@nestjs/core';
import { RESOURCE_ACCESS } from '../../common/resource-access/decorators/resource-access.decorator';
import { Message } from '../message.entity';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { when } from 'jest-when';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';
import { SendMessageDto } from '../dto/send-message.dto';
import { User } from '../../user/entities/user.entity';
import { Request } from 'express';

describe('ConversationsMessagesController', () => {
  let controller: ConversationsMessagesController;
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsMessagesController],
      providers: [
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
    service = module.get<MessageService>(MessageService);
  });

  describe('resource access strategy', () => {
    it('should use the CONVERSATION resource access strategy', () => {
      const reflector = new Reflector();

      const strategy = reflector.get(
        RESOURCE_ACCESS,
        ConversationsMessagesController,
      );

      expect(strategy).toEqual({
        strategy: { providerToken: ResourceAccessStrategyToken.CONVERSATION },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated messages for a conversation', async () => {
      const conversationId = 1;
      const paginationDto = new CursorPaginationDto();

      const expectedResponse = new BaseApiCursorPaginationResponse<Message>();
      Object.assign(expectedResponse, {
        results: [new Message(), new Message()],
        nextCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
        total: 2,
      });

      when(service.findAll)
        .calledWith(conversationId, paginationDto)
        .mockResolvedValue(expectedResponse);

      const result = await controller.findAll(conversationId, paginationDto);

      expect(result).toEqual(expectedResponse);
      expect(service.findAll).toHaveBeenCalledWith(
        conversationId,
        paginationDto,
      );
    });
  });

  describe('sendMessage', () => {
    it('should send a message to a conversation', async () => {
      const conversationId = 1;

      const sendMessageDto = new SendMessageDto();
      Object.assign(sendMessageDto, {
        content: 'Hello, world!',
      });

      const user = new User();
      user.id = 1;

      const req = createMock<Request>({ user });

      when(service.sendMessage)
        .calledWith(user.id, conversationId, sendMessageDto)
        .mockResolvedValue(new Message());

      await controller.sendMessage(req, conversationId, sendMessageDto);
    });
  });
});
