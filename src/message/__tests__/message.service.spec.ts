import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from '../message.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '../message.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { User } from '../../user/entities/user.entity';
import { ConversationsService } from '../../conversations/conversations.service';
import { AttachmentsService } from '../../attachments/attachments.service';
import { SendMessageDto } from '../dto/send-message.dto';
import {
  Attachment,
  AttachmentEntityType,
} from '../../attachments/attachment.entity';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Conversation } from '../../conversations/entities/conversation.entity';

describe('MessageService', () => {
  let service: MessageService;
  let messageRepository: Repository<Message>;
  let conversationsService: ConversationsService;
  let paginationService: PaginationService;
  let attachmentsService: AttachmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getRepositoryToken(Message),
          useValue: createMock<Repository<Message>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(MessageService);
    messageRepository = module.get(getRepositoryToken(Message));
    conversationsService = module.get(ConversationsService);
    paginationService = module.get(PaginationService);
    attachmentsService = module.get(AttachmentsService);
  });

  describe('findById', () => {
    it('should find a message by id', async () => {
      const messageId = 1;
      const message = new Message();
      Object.assign(message, {
        id: messageId,
        content: 'Hello, world!',
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: undefined,
        })
        .mockResolvedValue(message);

      const result = await service.findById(messageId);

      expect(result).toBeDefined();
      expect(result).toBe(message);
    });

    it('should find a message by id with relations', async () => {
      const messageId = 1;
      const message = new Message();
      Object.assign(message, {
        id: messageId,
        content: 'Hello, world!',
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { author: true },
        })
        .mockResolvedValue(message);

      const result = await service.findById(messageId, {
        relations: { author: true },
      });

      expect(result).toBeDefined();
      expect(result).toBe(message);
    });

    it('should find a message by id with additional where conditions', async () => {
      const messageId = 1;
      const conversationId = 2;
      const message = new Message();
      Object.assign(message, {
        id: messageId,
        conversationId,
        content: 'Hello, world!',
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId, conversationId },
          relations: undefined,
        })
        .mockResolvedValue(message);

      const result = await service.findById(messageId, {
        where: { conversationId },
      });

      expect(result).toBeDefined();
      expect(result).toBe(message);
    });

    it('should return null if message not found', async () => {
      const messageId = 1;

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: undefined,
        })
        .mockResolvedValue(null);

      const result = await service.findById(messageId);

      expect(result).toBeNull();
    });
  });

  describe('findByIdOrThrow', () => {
    it('should find a message by id or throw an error', async () => {
      const messageId = 1;
      const message = new Message();
      Object.assign(message, {
        id: messageId,
        content: 'Hello, world!',
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: undefined,
        })
        .mockResolvedValue(message);

      const result = await service.findByIdOrThrow(messageId);

      expect(result).toBeDefined();
      expect(result).toBe(message);
    });

    it('should throw NotFoundException if message not found', async () => {
      const messageId = 1;

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: undefined,
        })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(messageId)).rejects.toThrow(
        new NotFoundException('Message not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should find all messages for a conversation with pagination', async () => {
      const conversationId = 1;
      const paginationDto = new CursorPaginationDto();
      const message1 = new Message();
      const message2 = new Message();
      const author = new User();
      Object.assign(message1, {
        id: 1,
        content: 'Message 1',
        conversationId,
        author,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      Object.assign(message2, {
        id: 2,
        content: 'Message 2',
        conversationId,
        author,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const attachments = [new Attachment(), new Attachment()];

      const paginatedResponse = {
        results: [message1, message2],
        nextCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
      };

      when(paginationService.paginateWithCursor)
        .calledWith(messageRepository, paginationDto, {
          cursorColumn: 'id',
          relations: { author: true },
          where: { conversationId },
          order: {
            createdAt: 'DESC',
          },
        })
        .mockResolvedValue(paginatedResponse);

      when(attachmentsService.findByEntity)
        .calledWith(message1.id, AttachmentEntityType.MESSAGE)
        .mockResolvedValue(attachments);

      when(attachmentsService.findByEntity)
        .calledWith(message2.id, AttachmentEntityType.MESSAGE)
        .mockResolvedValue(attachments);

      const result = await service.findAll(conversationId, paginationDto);

      expect(result).toBeDefined();
      expect(result.results).toHaveLength(2);
      expect(result.results[0].attachments).toBe(attachments);
      expect(result.results[1].attachments).toBe(attachments);
      expect(result.nextCursor).toBe('2');
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe('sendMessage', () => {
    it('should send a message to a conversation', async () => {
      const authorId = 1;
      const conversationId = 2;
      const author = new User();
      Object.assign(author, { id: authorId });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        initiator: { id: authorId },
        participant: { id: 3 },
      });

      const sendMessageDto: SendMessageDto = {
        content: 'Hello, world!',
      };

      const message = new Message();
      Object.assign(message, {
        id: 1,
        author,
        conversationId,
        content: sendMessageDto.content,
      });

      when(conversationsService.findByIdOrThrow)
        .calledWith(conversationId)
        .mockResolvedValue(conversation);

      when(messageRepository.save)
        .calledWith({
          authorId,
          conversationId,
          content: sendMessageDto.content,
        })
        .mockResolvedValue(message);

      const result = await service.sendMessage(
        authorId,
        conversationId,
        sendMessageDto,
      );

      expect(result).toBeDefined();
      expect(result.author.id).toBe(authorId);
      expect(result.conversationId).toBe(conversationId);
      expect(result.content).toBe(sendMessageDto.content);
    });

    it('should send a message with attachments', async () => {
      const authorId = 1;
      const conversationId = 2;
      const author = new User();
      Object.assign(author, { id: authorId });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        initiator: { id: authorId },
        participant: { id: 3 },
      });

      const sendMessageDto: SendMessageDto = {
        content: 'Hello, world!',
      };

      const message = new Message();
      Object.assign(message, {
        id: 1,
        author,
        conversationId,
        content: sendMessageDto.content,
      });

      const files = [{ filename: 'test.jpg' }] as Express.Multer.File[];
      const attachments = [new Attachment(), new Attachment()];

      when(conversationsService.findByIdOrThrow)
        .calledWith(conversationId)
        .mockResolvedValue(conversation);

      when(messageRepository.save)
        .calledWith({
          authorId,
          conversationId,
          content: sendMessageDto.content,
        })
        .mockResolvedValue(message);

      when(attachmentsService.uploadFiles)
        .calledWith(message.id, AttachmentEntityType.MESSAGE, files, authorId)
        .mockResolvedValue(attachments);

      const result = await service.sendMessage(
        authorId,
        conversationId,
        sendMessageDto,
        files,
      );

      expect(result).toBeDefined();
      expect(result.author.id).toBe(authorId);
      expect(result.conversationId).toBe(conversationId);
      expect(result.content).toBe(sendMessageDto.content);
      expect(result.attachments).toBe(attachments);
    });

    it('should throw BadRequestException if content and attachments are empty', async () => {
      const authorId = 1;
      const conversationId = 2;
      const sendMessageDto: SendMessageDto = {};

      await expect(
        service.sendMessage(authorId, conversationId, sendMessageDto),
      ).rejects.toThrow(
        new BadRequestException('Message content or attachments are required'),
      );
    });

    it('should throw BadRequestException if user is not a participant', async () => {
      const authorId = 1;
      const conversationId = 2;
      const sendMessageDto: SendMessageDto = {
        content: 'Hello, world!',
      };

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        initiator: { id: 3 },
        participant: { id: 4 },
      });

      when(conversationsService.findByIdOrThrow)
        .calledWith(conversationId)
        .mockResolvedValue(conversation);

      await expect(
        service.sendMessage(authorId, conversationId, sendMessageDto),
      ).rejects.toThrow(
        new BadRequestException(
          'You are not a participant of this conversation',
        ),
      );
    });

    it('should throw BadRequestException if message fails to save', async () => {
      const authorId = 1;
      const conversationId = 2;
      const sendMessageDto: SendMessageDto = {
        content: 'Hello, world!',
      };

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        initiator: { id: authorId },
        participant: { id: 3 },
      });

      when(conversationsService.findByIdOrThrow)
        .calledWith(conversationId)
        .mockResolvedValue(conversation);

      when(messageRepository.save)
        .calledWith({
          authorId,
          conversationId,
          content: sendMessageDto.content,
        })
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.sendMessage(authorId, conversationId, sendMessageDto),
      ).rejects.toThrow(
        new BadRequestException('Failed to send message', {
          cause: new Error('Database error'),
        }),
      );
    });
  });

  describe('updateMessage', () => {
    it('should update a message', async () => {
      const userId = 1;
      const messageId = 2;
      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated content',
      };

      const message = new Message();
      Object.assign(message, {
        id: messageId,
        author: { id: userId },
        conversation: {
          initiator: { id: userId },
          participant: { id: 3 },
        },
        content: 'Original content',
      });

      const updatedMessage = new Message();
      Object.assign(updatedMessage, {
        ...message,
        content: updateMessageDto.content,
      });

      const attachments = [new Attachment(), new Attachment()];

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { conversation: true },
        })
        .mockResolvedValue(message);

      when(messageRepository.save)
        .calledWith(message)
        .mockResolvedValue(updatedMessage);

      when(attachmentsService.findByEntity)
        .calledWith(updatedMessage.id, AttachmentEntityType.MESSAGE)
        .mockResolvedValue(attachments);

      const result = await service.updateMessage(
        userId,
        messageId,
        updateMessageDto,
      );

      expect(result).toBeDefined();
      expect(result.content).toBe(updateMessageDto.content);
      expect(result.attachments).toBe(attachments);
    });

    it('should throw BadRequestException if content is empty', async () => {
      const userId = 1;
      const messageId = 2;
      const updateMessageDto: UpdateMessageDto = {};

      await expect(
        service.updateMessage(userId, messageId, updateMessageDto),
      ).rejects.toThrow(new BadRequestException('Message content is required'));
    });

    it('should throw BadRequestException if user is not the author', async () => {
      const userId = 1;
      const messageId = 2;
      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated content',
      };

      const message = new Message();
      Object.assign(message, {
        id: messageId,
        author: { id: 3 }, // Different user
        conversation: {
          initiator: { id: userId },
          participant: { id: 4 },
        },
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { conversation: true },
        })
        .mockResolvedValue(message);

      await expect(
        service.updateMessage(userId, messageId, updateMessageDto),
      ).rejects.toThrow(
        new BadRequestException('You are not the author of this message'),
      );
    });

    it('should throw BadRequestException if user is not a participant', async () => {
      const userId = 1;
      const messageId = 2;
      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated content',
      };

      const message = new Message();
      Object.assign(message, {
        id: messageId,
        author: { id: userId },
        conversation: {
          initiator: { id: 3 },
          participant: { id: 4 },
        },
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { conversation: true },
        })
        .mockResolvedValue(message);

      await expect(
        service.updateMessage(userId, messageId, updateMessageDto),
      ).rejects.toThrow(
        new BadRequestException(
          'You are not a participant of this conversation',
        ),
      );
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message', async () => {
      const userId = 1;
      const messageId = 2;

      const message = new Message();
      Object.assign(message, {
        id: messageId,
        author: { id: userId },
        conversation: {
          initiator: { id: userId },
          participant: { id: 3 },
        },
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { conversation: true },
        })
        .mockResolvedValue(message);

      when(attachmentsService.softDeleteByEntity)
        .calledWith(messageId, AttachmentEntityType.MESSAGE)
        .mockResolvedValue(undefined);

      when(messageRepository.softDelete)
        .calledWith(messageId)
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      await service.deleteMessage(userId, messageId);

      expect(attachmentsService.softDeleteByEntity).toHaveBeenCalledWith(
        messageId,
        AttachmentEntityType.MESSAGE,
      );
      expect(messageRepository.softDelete).toHaveBeenCalledWith(messageId);
    });

    it('should throw BadRequestException if user is not the author', async () => {
      const userId = 1;
      const messageId = 2;

      const message = new Message();
      Object.assign(message, {
        id: messageId,
        author: { id: 3 }, // Different user
        conversation: {
          initiator: { id: userId },
          participant: { id: 4 },
        },
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { conversation: true },
        })
        .mockResolvedValue(message);

      await expect(service.deleteMessage(userId, messageId)).rejects.toThrow(
        new BadRequestException('You are not the author of this message'),
      );
    });

    it('should throw BadRequestException if user is not a participant', async () => {
      const userId = 1;
      const messageId = 2;

      const message = new Message();
      Object.assign(message, {
        id: messageId,
        author: { id: userId },
        conversation: {
          initiator: { id: 3 },
          participant: { id: 4 },
        },
      });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { conversation: true },
        })
        .mockResolvedValue(message);

      await expect(service.deleteMessage(userId, messageId)).rejects.toThrow(
        new BadRequestException(
          'You are not a participant of this conversation',
        ),
      );
    });
  });
});
