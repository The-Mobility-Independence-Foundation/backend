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
      Object.assign(attachments[0], { key: 'attachment1.jpg' });
      Object.assign(attachments[1], { key: 'attachment2.jpg' });

      const paginatedResponse = {
        results: [message1, message2],
        nextCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
        previousCursor: null,
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

      when(attachmentsService.generateGetPresignedUrl)
        .calledWith('attachment1.jpg')
        .mockResolvedValue('https://example.com/attachment1.jpg');

      when(attachmentsService.generateGetPresignedUrl)
        .calledWith('attachment2.jpg')
        .mockResolvedValue('https://example.com/attachment2.jpg');

      const result = await service.findAll(conversationId, paginationDto);

      expect(result).toBeDefined();
      expect(result.results).toHaveLength(2);
      expect(result.results[0].attachments).toHaveLength(2);
      expect(result.results[0].attachments[0].url).toBe(
        'https://example.com/attachment1.jpg',
      );
      expect(result.results[0].attachments[1].url).toBe(
        'https://example.com/attachment2.jpg',
      );
      expect(result.results[1].attachments).toHaveLength(2);
      expect(result.results[1].attachments[0].url).toBe(
        'https://example.com/attachment1.jpg',
      );
      expect(result.results[1].attachments[1].url).toBe(
        'https://example.com/attachment2.jpg',
      );
      expect(result.nextCursor).toBe('2');
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.previousCursor).toBeNull();
    });
  });

  describe('sendMessage', () => {
    it('should send a message to a conversation', async () => {
      const authorId = 1;
      const author = new User();
      Object.assign(author, { id: authorId });

      const conversationId = 2;
      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        initiatorId: authorId,
        participantId: 3,
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
      const author = new User();
      Object.assign(author, { id: authorId });

      const conversationId = 2;
      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        initiatorId: authorId,
        participantId: 3,
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
      Object.assign(attachments[0], { key: 'attachment1.jpg' });
      Object.assign(attachments[1], { key: 'attachment2.jpg' });

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

      when(attachmentsService.generateGetPresignedUrl)
        .calledWith('attachment1.jpg')
        .mockResolvedValue('https://example.com/attachment1.jpg');

      when(attachmentsService.generateGetPresignedUrl)
        .calledWith('attachment2.jpg')
        .mockResolvedValue('https://example.com/attachment2.jpg');

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
      expect(result.attachments).toHaveLength(2);
      expect(result.attachments[0].url).toBe(
        'https://example.com/attachment1.jpg',
      );
      expect(result.attachments[1].url).toBe(
        'https://example.com/attachment2.jpg',
      );
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

    it('should throw BadRequestException if attachments fail to upload', async () => {
      const authorId = 1;
      const author = new User();
      Object.assign(author, { id: authorId });

      const conversationId = 2;
      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        initiatorId: authorId,
        participantId: 3,
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
        .mockRejectedValue(new Error('Failed to upload attachments'));

      await expect(
        service.sendMessage(authorId, conversationId, sendMessageDto, files),
      ).rejects.toThrow(
        new BadRequestException('Failed to send message', {
          cause: new Error('Failed to upload attachments'),
        }),
      );
      expect(messageRepository.delete).toHaveBeenCalledWith(message.id);
    });
  });

  describe('updateMessage', () => {
    it('should update a message', async () => {
      const userId = 1;

      const messageId = 2;
      const message = new Message();
      Object.assign(message, {
        id: messageId,
        authorId: userId,
        conversation: {
          initiatorId: userId,
          participantId: 3,
        },
        content: 'Original content',
      });

      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated content',
      };

      const updatedMessage = new Message();
      Object.assign(updatedMessage, {
        ...message,
        content: updateMessageDto.content,
      });

      const attachments = [new Attachment(), new Attachment()];
      Object.assign(attachments[0], { key: 'attachment1.jpg' });
      Object.assign(attachments[1], { key: 'attachment2.jpg' });

      when(messageRepository.findOne)
        .calledWith({
          where: { id: messageId },
          relations: { conversation: true },
        })
        .mockResolvedValue(message);

      when(messageRepository.save)
        .calledWith(updatedMessage)
        .mockResolvedValue(updatedMessage);

      when(attachmentsService.findByEntity)
        .calledWith(updatedMessage.id, AttachmentEntityType.MESSAGE)
        .mockResolvedValue(attachments);

      when(attachmentsService.generateGetPresignedUrl)
        .calledWith('attachment1.jpg')
        .mockResolvedValue('https://example.com/attachment1.jpg');

      when(attachmentsService.generateGetPresignedUrl)
        .calledWith('attachment2.jpg')
        .mockResolvedValue('https://example.com/attachment2.jpg');

      const result = await service.updateMessage(
        userId,
        messageId,
        updateMessageDto,
      );

      expect(result).toBeDefined();
      expect(result.content).toBe(updateMessageDto.content);
      expect(result.attachments).toHaveLength(2);
      expect(result.attachments[0].url).toBe(
        'https://example.com/attachment1.jpg',
      );
      expect(result.attachments[1].url).toBe(
        'https://example.com/attachment2.jpg',
      );
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

      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated content',
      };

      const messageId = 2;
      const message = new Message();
      Object.assign(message, {
        id: messageId,
        authorId: 3,
        conversation: {
          initiatorId: userId,
          participantId: 4,
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

      const updateMessageDto: UpdateMessageDto = {
        content: 'Updated content',
      };

      const messageId = 2;
      const message = new Message();
      Object.assign(message, {
        id: messageId,
        authorId: userId,
        conversation: {
          initiatorId: 3,
          participantId: 4,
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
        authorId: userId,
        conversation: {
          initiatorId: userId,
          participantId: 3,
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
        authorId: 3,
        conversation: {
          initiatorId: userId,
          participantId: 4,
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
        authorId: userId,
        conversation: {
          initiatorId: 3,
          participantId: 4,
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
