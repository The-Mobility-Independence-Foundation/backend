import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../conversations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Conversation,
  ConversationType,
} from '../entities/conversation.entity';
import { Listing } from '../../listing/listing.entity';
import { User } from '../../user/entities/user.entity';
import { ConversationHandlerHistory } from '../entities/conversation-handler-history.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { ListingService } from '../../listing/listing.service';
import { PaginationService } from '../../common/services/pagination.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';
import { when } from 'jest-when';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let conversationRepository: Repository<Conversation>;
  let handlerHistoryRepository: Repository<ConversationHandlerHistory>;
  let userService: UserService;
  let listingService: ListingService;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: createMock<Repository<Conversation>>(),
        },
        {
          provide: getRepositoryToken(ConversationHandlerHistory),
          useValue: createMock<Repository<ConversationHandlerHistory>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(ConversationsService);
    conversationRepository = module.get(getRepositoryToken(Conversation));
    handlerHistoryRepository = module.get(
      getRepositoryToken(ConversationHandlerHistory),
    );
    userService = module.get(UserService);
    listingService = module.get(ListingService);
    paginationService = module.get(PaginationService);
  });

  describe('findById', () => {
    it('should find a conversation by id', async () => {
      const conversation = new Conversation();
      Object.assign(conversation, {
        id: 1,
        type: ConversationType.DIRECT,
        initiatorId: 1,
        participantId: 2,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversation.id },
        })
        .mockResolvedValue(conversation);

      const result = await service.findById(conversation.id);

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
    });

    it('should find a conversation by id with additional where conditions', async () => {
      const conversation = new Conversation();
      Object.assign(conversation, {
        id: 1,
        type: ConversationType.DIRECT,
        initiatorId: 1,
        participantId: 2,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversation.id, type: ConversationType.DIRECT },
        })
        .mockResolvedValue(conversation);

      const result = await service.findById(conversation.id, {
        where: { type: ConversationType.DIRECT },
      });

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
    });

    it('should find a conversation by id with relations', async () => {
      const conversation = new Conversation();
      Object.assign(conversation, {
        id: 1,
        type: ConversationType.DIRECT,
        initiatorId: 1,
        participantId: 2,
      });

      const initiator = new User();
      conversation.initiator = initiator;

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversation.id },
          relations: { initiator: true },
        })
        .mockResolvedValue(conversation);

      const result = await service.findById(conversation.id, {
        relations: { initiator: true },
      });

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
      expect(result?.initiator).toBe(initiator);
    });

    it('should return null if conversation not found', async () => {
      when(conversationRepository.findOne)
        .calledWith({
          where: { id: 1 },
        })
        .mockResolvedValue(null);

      const result = await service.findById(1);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all conversations for a user with pagination', async () => {
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

      when(paginationService.paginateWithCursor)
        .calledWith(conversationRepository, paginationDto, {
          cursorColumn: 'id',
        })
        .mockResolvedValue(expectedResponse);

      const result = await service.findAll(userId, paginationDto);

      expect(result).toBeDefined();
      expect(result).toBe(expectedResponse);
      expect(result.results).toHaveLength(expectedResponse.results.length);
      expect(result.nextCursor).toBe(expectedResponse.nextCursor);
      expect(result.hasNextPage).toBe(expectedResponse.hasNextPage);
      expect(result.hasPreviousPage).toBe(expectedResponse.hasPreviousPage);
    });
  });

  describe('initiateDirectConversation', () => {
    it('should initiate a direct conversation between users', async () => {
      const initiatorId = 1;
      const participantId = 2;

      const initiator = new User();
      Object.assign(initiator, { id: initiatorId });

      const participant = new User();
      Object.assign(participant, { id: participantId });

      const conversation = new Conversation();
      Object.assign(conversation, {
        initiatorId,
        participantId,
        type: ConversationType.DIRECT,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: [
            { initiatorId, participantId },
            { initiatorId: participantId, participantId: initiatorId },
          ],
        })
        .mockResolvedValue(null);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(initiator);

      when(userService.findById)
        .calledWith(participantId)
        .mockResolvedValue(participant);

      when(conversationRepository.create)
        .calledWith({
          initiatorId,
          participantId,
          type: ConversationType.DIRECT,
        })
        .mockReturnValue(conversation);

      when(conversationRepository.insert)
        .calledWith(conversation)
        .mockResolvedValue({} as any);

      const result = await service.initiateDirectConversation(
        initiatorId,
        participantId,
      );

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
      expect(result.initiatorId).toBe(initiatorId);
      expect(result.participantId).toBe(participantId);
      expect(result.type).toBe(ConversationType.DIRECT);
    });

    it('should throw BadRequestException if initiator and recipient are the same', async () => {
      const userId = 1;

      await expect(
        service.initiateDirectConversation(userId, userId),
      ).rejects.toThrow(
        new BadRequestException('Initiator and recipient cannot be the same'),
      );
    });

    it('should throw BadRequestException if conversation already exists', async () => {
      const initiatorId = 1;
      const participantId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: [
            { initiatorId, participantId },
            { initiatorId: participantId, participantId: initiatorId },
          ],
        })
        .mockResolvedValue(new Conversation());

      await expect(
        service.initiateDirectConversation(initiatorId, participantId),
      ).rejects.toThrow(new BadRequestException('Conversation already exists'));
    });

    it('should throw NotFoundException if initiator not found', async () => {
      const initiatorId = 1;
      const participantId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: [
            { initiatorId, participantId },
            { initiatorId: participantId, participantId: initiatorId },
          ],
        })
        .mockResolvedValue(null);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(null);

      await expect(
        service.initiateDirectConversation(initiatorId, participantId),
      ).rejects.toThrow(new NotFoundException('Initiator not found'));
    });

    it('should throw NotFoundException if participant not found', async () => {
      const initiatorId = 1;
      const participantId = 2;

      const initiator = new User();
      Object.assign(initiator, { id: initiatorId });

      when(conversationRepository.findOne)
        .calledWith({
          where: [
            { initiatorId, participantId },
            { initiatorId: participantId, participantId: initiatorId },
          ],
        })
        .mockResolvedValue(null);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(initiator);

      when(userService.findById)
        .calledWith(participantId)
        .mockResolvedValue(null);

      await expect(
        service.initiateDirectConversation(initiatorId, participantId),
      ).rejects.toThrow(new NotFoundException('Participant not found'));
    });
  });

  describe('initiateListingConversation', () => {
    it('should initiate a listing conversation', async () => {
      const initiatorId = 1;
      const listingId = 2;

      const initiator = new User();
      Object.assign(initiator, { id: initiatorId });

      const listing = new Listing();
      Object.assign(listing, { id: listingId });

      const conversation = new Conversation();
      Object.assign(conversation, {
        initiatorId,
        listingId,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(initiator);

      when(listingService.findById)
        .calledWith(listingId)
        .mockResolvedValue(listing);

      when(conversationRepository.create)
        .calledWith({
          initiatorId,
          listingId,
          type: ConversationType.INQUIRY,
        })
        .mockReturnValue(conversation);

      when(conversationRepository.insert)
        .calledWith(conversation)
        .mockResolvedValue({} as any);

      const result = await service.initiateListingConversation(
        initiatorId,
        listingId,
      );

      expect(result).toBeDefined();
      expect(result).toBe(conversation);
      expect(result.initiatorId).toBe(initiatorId);
      expect(result.listingId).toBe(listingId);
      expect(result.type).toBe(ConversationType.INQUIRY);
    });

    it('should throw BadRequestException if conversation already exists', async () => {
      const initiatorId = 1;
      const listingId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(new Conversation());

      await expect(
        service.initiateListingConversation(initiatorId, listingId),
      ).rejects.toThrow(new BadRequestException('Conversation already exists'));
    });

    it('should throw NotFoundException if initiator not found', async () => {
      const initiatorId = 1;
      const listingId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(null);

      await expect(
        service.initiateListingConversation(initiatorId, listingId),
      ).rejects.toThrow(new NotFoundException('Initiator not found'));
    });

    it('should throw NotFoundException if listing not found', async () => {
      const initiatorId = 1;
      const listingId = 2;

      const initiator = new User();
      Object.assign(initiator, { id: initiatorId });

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(initiator);

      when(listingService.findById)
        .calledWith(listingId)
        .mockResolvedValue(null);

      await expect(
        service.initiateListingConversation(initiatorId, listingId),
      ).rejects.toThrow(new NotFoundException('Listing not found'));
    });
  });

  describe('doesConversationExist', () => {
    it('should return true if direct conversation exists', async () => {
      const initiatorId = 1;
      const participantId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: [
            { initiatorId, participantId },
            { initiatorId: participantId, participantId: initiatorId },
          ],
        })
        .mockResolvedValue(new Conversation());

      const result = await service.doesConversationExist({
        initiatorId,
        participantId,
      });

      expect(result).toBe(true);
    });

    it('should return false if direct conversation does not exist', async () => {
      const initiatorId = 1;
      const participantId = 2;

      when(conversationRepository.findOne).mockResolvedValue(null);

      const result = await service.doesConversationExist({
        initiatorId,
        participantId,
      });

      expect(result).toBe(false);
    });

    it('should return true if listing conversation exists', async () => {
      const initiatorId = 1;
      const listingId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(new Conversation());

      const result = await service.doesConversationExist({
        initiatorId,
        listingId,
      });

      expect(result).toBe(true);
    });

    it('should return false if listing conversation does not exist', async () => {
      const initiatorId = 1;
      const listingId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      const result = await service.doesConversationExist({
        initiatorId,
        listingId,
      });

      expect(result).toBe(false);
    });
  });

  describe('enterConversation', () => {
    it('should enter a conversation as a handler', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
      });

      const listing = new Listing();
      Object.assign(listing, {
        owner: { id: 3 },
      });
      conversation.listing = listing;

      const handler = new User();
      Object.assign(handler, {
        id: handlerId,
        organization: { id: 3 },
      });

      const handlerHistory = new ConversationHandlerHistory();
      Object.assign(handlerHistory, {
        conversation,
        handler,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
            listing: true,
          },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(handlerId)
        .mockResolvedValue(handler);

      when(handlerHistoryRepository.create)
        .calledWith({
          conversation,
          handler,
        })
        .mockReturnValue(handlerHistory);

      when(handlerHistoryRepository.insert)
        .calledWith(handlerHistory)
        .mockResolvedValue({} as any);

      when(conversationRepository.save)
        .calledWith(conversation)
        .mockResolvedValue(conversation);

      const result = await service.enterConversation(handlerId, conversationId);

      expect(result).toBe(conversation);
      expect(result.handler).toBe(handler);
      expect(handlerHistoryRepository.create).toHaveBeenCalledWith({
        conversation,
        handler,
      });
      expect(handlerHistoryRepository.insert).toHaveBeenCalledWith(
        handlerHistory,
      );
      expect(conversationRepository.save).toHaveBeenCalledWith(conversation);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      const handlerId = 1;
      const conversationId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
            listing: true,
          },
        })
        .mockResolvedValue(null);

      await expect(
        service.enterConversation(handlerId, conversationId),
      ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });

    it('should throw BadRequestException if conversation is not an inquiry', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
            listing: true,
          },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.enterConversation(handlerId, conversationId),
      ).rejects.toThrow(
        new BadRequestException('Conversation is not an inquiry'),
      );
    });

    it('should throw NotFoundException if handler not found', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
            listing: true,
          },
        })
        .mockResolvedValue(conversation);

      when(userService.findById).calledWith(handlerId).mockResolvedValue(null);

      await expect(
        service.enterConversation(handlerId, conversationId),
      ).rejects.toThrow(new NotFoundException('Handler not found'));
    });

    it('should throw BadRequestException if conversation already has a handler', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
        handlerId: 3,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
            listing: true,
          },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.enterConversation(handlerId, conversationId),
      ).rejects.toThrow(
        new BadRequestException('Conversation already has a handler'),
      );
    });

    it('should throw BadRequestException if handler is not part of the organization', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
      });

      const listing = new Listing();
      Object.assign(listing, {
        ownerId: 3,
      });
      conversation.listing = listing;

      const handler = new User();
      Object.assign(handler, {
        id: handlerId,
        organizationId: 4,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
            listing: true,
          },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(handlerId)
        .mockResolvedValue(handler);

      await expect(
        service.enterConversation(handlerId, conversationId),
      ).rejects.toThrow(
        new BadRequestException(
          'Handler is not part of the organization that owns the listing',
        ),
      );
    });
  });

  describe('leaveConversation', () => {
    it('should leave a conversation as a handler', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        handlerId,
        type: ConversationType.INQUIRY,
      });

      const handlerHistory = new ConversationHandlerHistory();
      Object.assign(handlerHistory, {
        conversationId,
        handlerId,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
          },
        })
        .mockResolvedValue(conversation);

      when(handlerHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, handlerId },
        })
        .mockResolvedValue(handlerHistory);

      when(handlerHistoryRepository.save)
        .calledWith(handlerHistory)
        .mockResolvedValue(handlerHistory);

      when(conversationRepository.save)
        .calledWith(conversation)
        .mockResolvedValue(conversation);

      await service.leaveConversation(handlerId, conversationId);

      expect(handlerHistory.unassignedAt).toBeDefined();
      expect(conversation.handler).toBeNull();
      expect(handlerHistoryRepository.save).toHaveBeenCalledWith(
        handlerHistory,
      );
      expect(conversationRepository.save).toHaveBeenCalledWith(conversation);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      const handlerId = 1;
      const conversationId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
          },
        })
        .mockResolvedValue(null);

      await expect(
        service.leaveConversation(handlerId, conversationId),
      ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });

    it('should throw BadRequestException if conversation is not an inquiry', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
          },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.leaveConversation(handlerId, conversationId),
      ).rejects.toThrow(
        new BadRequestException('Conversation is not an inquiry'),
      );
    });

    it('should throw BadRequestException if user is not the handler', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        handlerId: 3,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
          },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.leaveConversation(handlerId, conversationId),
      ).rejects.toThrow(
        new BadRequestException('User is not the handler of the conversation'),
      );
    });

    it('should throw NotFoundException if handler history not found', async () => {
      const handlerId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        handlerId,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: {
            initiator: true,
            participant: true,
          },
        })
        .mockResolvedValue(conversation);

      when(handlerHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, handlerId },
        })
        .mockResolvedValue(null);

      await expect(
        service.leaveConversation(handlerId, conversationId),
      ).rejects.toThrow(
        new NotFoundException('Handler history record not found'),
      );
    });
  });
});
