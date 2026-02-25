import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsMessagesController } from '../conversations-messages.controller';
import { MessageService } from '../message.service';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { User } from '../../user/entities/user.entity';
import { Attachment } from '../../attachments/attachment.entity';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';
import { MessageResponse } from '../respones/message.response';
import { SendMessageResponse } from '../respones/send-message.response';
import { UpdateMessageResponse } from '../respones/update-message.response';
import {
  STRATEGY_PROVIDERS_TOKEN,
  ResourceAccessStrategyRegistry,
} from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('ConversationsMessagesController', () => {
  let controller: ConversationsMessagesController;
  let messageService: MessageService;

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

    controller = module.get(ConversationsMessagesController);
    messageService = module.get(MessageService);
  });

  describe('findAll', () => {
    it('should successfully retrieve messages for a conversation', async () => {
      const conversationId = 1;
      const paginationDto = new CursorPaginationDto();
      Object.assign(paginationDto, {
        cursor: 'cursor123',
        limit: 10,
        direction: 'next',
      });

      const user = new User();
      const attachment = new Attachment();
      Object.assign(attachment, { url: 'https://example.com/test.jpg' });

      const messageResponse: MessageResponse = {
        id: 1,
        author: user,
        conversationId,
        content: 'Hello world',
        attachments: [attachment as Attachment & { url: string }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResponse =
        new BaseApiCursorPaginationResponse<MessageResponse>();
      Object.assign(expectedResponse, {
        results: [messageResponse],
        nextCursor: 'nextCursor123',
        hasNextPage: true,
        hasPreviousPage: false,
      });

      when(messageService.findAll)
        .calledWith(conversationId, paginationDto)
        .mockResolvedValue(expectedResponse);

      const result = await controller.findAll(conversationId, paginationDto);

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(messageService.findAll).toHaveBeenCalledWith(
        conversationId,
        paginationDto,
      );
    });
  });

  describe('sendMessage', () => {
    it('should successfully send a message to a conversation', async () => {
      const conversationId = 1;
      const user = new User();
      Object.assign(user, { id: 123 });

      const sendMessageDto: SendMessageDto = {
        content: 'Hello, how are you?',
      };

      const files: Express.Multer.File[] = [];
      const attachment = new Attachment();
      Object.assign(attachment, { url: 'https://example.com/test.jpg' });

      const expectedResponse: SendMessageResponse = {
        id: 1,
        author: user,
        conversationId,
        content: sendMessageDto.content,
        attachments: [attachment as Attachment & { url: string }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      when(messageService.sendMessage)
        .calledWith(user.id, conversationId, sendMessageDto, files)
        .mockResolvedValue(expectedResponse);

      const result = await controller.sendMessage(
        user,
        conversationId,
        sendMessageDto,
        files,
      );

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        user.id,
        conversationId,
        sendMessageDto,
        files,
      );
    });

    it('should successfully send a message with file attachments', async () => {
      const conversationId = 1;
      const user = new User();
      Object.assign(user, { id: 123 });

      const sendMessageDto: SendMessageDto = {
        content: 'Check out this file',
      };

      const files = [
        {
          fieldname: 'file',
          originalname: 'test.jpg',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test'),
          size: 4,
        },
      ] as Express.Multer.File[];

      const attachment = new Attachment();
      Object.assign(attachment, {
        id: 1,
        entityId: 1,
        entityType: 'message',
        fileName: 'test.jpg',
        url: 'https://example.com/test.jpg',
      });

      const expectedResponse: SendMessageResponse = {
        id: 1,
        author: user,
        conversationId,
        content: sendMessageDto.content,
        attachments: [attachment as Attachment & { url: string }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      when(messageService.sendMessage)
        .calledWith(user.id, conversationId, sendMessageDto, files)
        .mockResolvedValue(expectedResponse);

      const result = await controller.sendMessage(
        user,
        conversationId,
        sendMessageDto,
        files,
      );

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(result.attachments).toHaveLength(1);
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        user.id,
        conversationId,
        sendMessageDto,
        files,
      );
    });
  });

  describe('updateMessage', () => {
    it('should successfully update a message', async () => {
      const messageId = 1;
      const conversationId = 1;

      const user = new User();
      Object.assign(user, { id: 123 });

      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated content',
      };

      const attachment = new Attachment();
      Object.assign(attachment, { url: 'https://example.com/test.jpg' });

      const expectedResponse: UpdateMessageResponse = {
        id: messageId,
        author: user,
        conversationId,
        content: updateMessageDto.content,
        attachments: [attachment as Attachment & { url: string }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      when(messageService.updateMessage)
        .calledWith(user.id, messageId, updateMessageDto)
        .mockResolvedValue(expectedResponse);

      const result = await controller.updateMessage(
        user,
        conversationId,
        messageId,
        updateMessageDto,
      );

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(result.content).toBe(updateMessageDto.content);
      expect(messageService.updateMessage).toHaveBeenCalledWith(
        user.id,
        messageId,
        updateMessageDto,
      );
    });
  });

  describe('deleteMessage', () => {
    it('should successfully delete a message', async () => {
      const messageId = 1;
      const conversationId = 1;

      const user = new User();
      Object.assign(user, { id: 123 });

      when(messageService.deleteMessage)
        .calledWith(user.id, messageId)
        .mockResolvedValue(undefined);

      const result = await controller.deleteMessage(
        user,
        conversationId,
        messageId,
      );

      expect(result).toBeUndefined();
      expect(messageService.deleteMessage).toHaveBeenCalledWith(
        user.id,
        messageId,
      );
    });
  });
});
