import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from '../conversations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Conversation,
  ConversationType,
} from '../entities/conversation.entity';
import { Listing, ListingStatus } from '../../listings/listing.entity';
import { User } from '../../user/entities/user.entity';
import { ConversationHistory } from '../entities/conversation-history.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { ListingsService } from '../../listings/listings.service';
import { PaginationService } from '../../common/services/pagination.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';
import { when } from 'jest-when';
import { UserRole } from '../../user/entities/user.entity';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let conversationRepository: Repository<Conversation>;
  let conversationHistoryRepository: Repository<ConversationHistory>;
  let userService: UserService;
  let listingsService: ListingsService;
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
          provide: getRepositoryToken(ConversationHistory),
          useValue: createMock<Repository<ConversationHistory>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(ConversationsService);
    conversationRepository = module.get(getRepositoryToken(Conversation));
    conversationHistoryRepository = module.get(
      getRepositoryToken(ConversationHistory),
    );
    userService = module.get(UserService);
    listingsService = module.get(ListingsService);
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
          where: [{ initiatorId: userId }, { participantId: userId }],
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

  describe('getLatestParticipantHistory', () => {
    it('should get the latest participant history for a conversation', async () => {
      const conversationId = 1;
      const participantId = 2;

      const participantHistory = new ConversationHistory();
      Object.assign(participantHistory, {
        conversationId,
        participantId,
        assignedAt: new Date(),
      });

      when(conversationHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, participantId },
          order: { assignedAt: 'DESC' },
        })
        .mockResolvedValue(participantHistory);

      const result = await service.getLatestParticipantHistory(
        conversationId,
        participantId,
      );

      expect(result).toBeDefined();
      expect(result).toBe(participantHistory);
      expect(result?.conversationId).toBe(conversationId);
      expect(result?.participantId).toBe(participantId);
    });

    it('should return null if no participant history found', async () => {
      const conversationId = 1;
      const participantId = 2;

      when(conversationHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, participantId },
          order: { assignedAt: 'DESC' },
        })
        .mockResolvedValue(null);

      const result = await service.getLatestParticipantHistory(
        conversationId,
        participantId,
      );

      expect(result).toBeNull();
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

    it('should throw BadRequestException if initiator and participant are the same', async () => {
      const userId = 1;

      await expect(
        service.initiateDirectConversation(userId, userId),
      ).rejects.toThrow(
        new BadRequestException('Initiator and participant cannot be the same'),
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
      Object.assign(initiator, { id: initiatorId, organizationId: 2 });

      const listing = new Listing();
      Object.assign(listing, {
        id: listingId,
        status: ListingStatus.ACTIVE,
        organizationId: 3,
      });

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

      when(listingsService.findByIdOrThrow)
        .calledWith(listingId)
        .mockResolvedValue(listing);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(initiator);

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

    it('should throw NotFoundException if listing not found', async () => {
      const initiatorId = 1;
      const listingId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      when(listingsService.findByIdOrThrow)
        .calledWith(listingId)
        .mockRejectedValue(new NotFoundException('Listing not found'));

      await expect(
        service.initiateListingConversation(initiatorId, listingId),
      ).rejects.toThrow(new NotFoundException('Listing not found'));
    });

    it('should throw BadRequestException if listing is not active', async () => {
      const initiatorId = 1;
      const listingId = 2;
      const listing = new Listing();
      Object.assign(listing, {
        id: listingId,
        status: ListingStatus.INACTIVE,
        organizationId: 3,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      when(listingsService.findByIdOrThrow)
        .calledWith(listingId)
        .mockResolvedValue(listing);

      await expect(
        service.initiateListingConversation(initiatorId, listingId),
      ).rejects.toThrow(new BadRequestException('Listing is not active'));
    });

    it('should throw NotFoundException if initiator not found', async () => {
      const initiatorId = 1;
      const listingId = 2;
      const listing = new Listing();
      Object.assign(listing, {
        id: listingId,
        status: ListingStatus.ACTIVE,
        organizationId: 3,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      when(listingsService.findByIdOrThrow)
        .calledWith(listingId)
        .mockResolvedValue(listing);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(null);

      await expect(
        service.initiateListingConversation(initiatorId, listingId),
      ).rejects.toThrow(new NotFoundException('Initiator not found'));
    });

    it('should throw BadRequestException if initiator is part of the organization that owns the listing', async () => {
      const initiatorId = 1;
      const listingId = 2;

      const initiator = new User();
      Object.assign(initiator, { id: initiatorId, organizationId: 1 });

      const listing = new Listing();
      Object.assign(listing, {
        id: listingId,
        status: ListingStatus.ACTIVE,
        organizationId: 1,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { initiatorId, listingId },
        })
        .mockResolvedValue(null);

      when(listingsService.findByIdOrThrow)
        .calledWith(listingId)
        .mockResolvedValue(listing);

      when(userService.findById)
        .calledWith(initiatorId)
        .mockResolvedValue(initiator);

      await expect(
        service.initiateListingConversation(initiatorId, listingId),
      ).rejects.toThrow(
        new BadRequestException(
          'Initiator cannot initiate a conversation with their own organization',
        ),
      );
    });
  });

  describe('enterListingConversation', () => {
    it('should enter a conversation as a participant', async () => {
      const participantId = 1;
      const conversationId = 2;

      const listing = new Listing();
      Object.assign(listing, {
        organizationId: 3,
      });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
        listing,
      });

      const participant = new User();
      Object.assign(participant, {
        id: participantId,
        organizationId: 3,
      });

      const participantHistory = new ConversationHistory();
      Object.assign(participantHistory, {
        conversation,
        participant,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(participantId)
        .mockResolvedValue(participant);

      when(conversationHistoryRepository.create)
        .calledWith({
          conversation,
          participant,
        })
        .mockReturnValue(participantHistory);

      when(conversationHistoryRepository.insert)
        .calledWith(participantHistory)
        .mockResolvedValue({} as any);

      when(conversationRepository.save)
        .calledWith(conversation)
        .mockResolvedValue(conversation);

      const result = await service.enterListingConversation(
        participantId,
        conversationId,
      );

      expect(result).toBe(conversation);
      expect(result.participant).toBe(participant);
      expect(conversationHistoryRepository.create).toHaveBeenCalledWith({
        conversation,
        participant,
      });
      expect(conversationHistoryRepository.insert).toHaveBeenCalledWith(
        participantHistory,
      );
      expect(conversationRepository.save).toHaveBeenCalledWith(conversation);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      const participantId = 1;
      const conversationId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(null);

      await expect(
        service.enterListingConversation(participantId, conversationId),
      ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });

    it('should throw BadRequestException if conversation is not an inquiry', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.enterListingConversation(participantId, conversationId),
      ).rejects.toThrow(
        new BadRequestException('Conversation is not an inquiry'),
      );
    });

    it('should throw NotFoundException if participant not found', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(participantId)
        .mockResolvedValue(null);

      await expect(
        service.enterListingConversation(participantId, conversationId),
      ).rejects.toThrow(new NotFoundException('Participant not found'));
    });

    it('should throw BadRequestException if user is already a participant', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
        participantId,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.enterListingConversation(participantId, conversationId),
      ).rejects.toThrow(
        new BadRequestException(
          'User is already a participant of the conversation',
        ),
      );
    });

    it('should throw BadRequestException if conversation already has a participant', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
        participantId: 3,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.enterListingConversation(participantId, conversationId),
      ).rejects.toThrow(
        new BadRequestException('Conversation already has a participant'),
      );
    });

    it('should throw BadRequestException if participant is not part of the organization', async () => {
      const participantId = 1;
      const conversationId = 2;

      const listing = new Listing();
      Object.assign(listing, {
        organizationId: 3,
      });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.INQUIRY,
        listing,
      });

      const participant = new User();
      Object.assign(participant, {
        id: participantId,
        organizationId: 4,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(participantId)
        .mockResolvedValue(participant);

      await expect(
        service.enterListingConversation(participantId, conversationId),
      ).rejects.toThrow(
        new BadRequestException(
          'Participant is not part of the organization that owns the listing',
        ),
      );
    });
  });

  describe('leaveListingConversation', () => {
    it('should leave a conversation as a participant', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId,
        type: ConversationType.INQUIRY,
      });

      const participantHistory = new ConversationHistory();
      Object.assign(participantHistory, {
        conversationId,
        participantId,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
        })
        .mockResolvedValue(conversation);

      when(conversationHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, participantId },
          order: { assignedAt: 'DESC' },
        })
        .mockResolvedValue(participantHistory);

      when(conversationHistoryRepository.save)
        .calledWith(participantHistory)
        .mockResolvedValue(participantHistory);

      when(conversationRepository.save)
        .calledWith(conversation)
        .mockResolvedValue(conversation);

      await service.leaveListingConversation(participantId, conversationId);

      expect(participantHistory.unassignedAt).toBeDefined();
      expect(conversation.participant).toBeNull();
      expect(conversationHistoryRepository.save).toHaveBeenCalledWith(
        participantHistory,
      );
      expect(conversationRepository.save).toHaveBeenCalledWith(conversation);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      const participantId = 1;
      const conversationId = 2;

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
        })
        .mockResolvedValue(null);

      await expect(
        service.leaveListingConversation(participantId, conversationId),
      ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });

    it('should throw BadRequestException if conversation is not an inquiry', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.leaveListingConversation(participantId, conversationId),
      ).rejects.toThrow(
        new BadRequestException('Conversation is not an inquiry'),
      );
    });

    it('should throw BadRequestException if user is not the participant', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId: 3,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.leaveListingConversation(participantId, conversationId),
      ).rejects.toThrow(
        new BadRequestException(
          'User is not the participant of the conversation',
        ),
      );
    });

    it('should throw NotFoundException if participant history not found', async () => {
      const participantId = 1;
      const conversationId = 2;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
        })
        .mockResolvedValue(conversation);

      when(conversationHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, participantId },
          order: { assignedAt: 'DESC' },
        })
        .mockResolvedValue(null);

      await expect(
        service.leaveListingConversation(participantId, conversationId),
      ).rejects.toThrow(
        new NotFoundException('Participant history record not found'),
      );
    });
  });

  describe('removeParticipantFromListingConversation', () => {
    it('should remove a participant from a conversation as an admin', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      const listing = new Listing();
      Object.assign(listing, {
        organizationId: 4,
      });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId,
        type: ConversationType.INQUIRY,
        listing,
      });

      const executor = new User();
      Object.assign(executor, {
        id: executorId,
        type: UserRole.ADMIN,
      });

      const participantHistory = new ConversationHistory();
      Object.assign(participantHistory, {
        conversationId,
        participantId,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(executorId)
        .mockResolvedValue(executor);

      when(conversationHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, participantId },
          order: { assignedAt: 'DESC' },
        })
        .mockResolvedValue(participantHistory);

      when(conversationHistoryRepository.save)
        .calledWith(participantHistory)
        .mockResolvedValue(participantHistory);

      when(conversationRepository.save)
        .calledWith(conversation)
        .mockResolvedValue(conversation);

      await service.removeParticipantFromListingConversation(
        executorId,
        participantId,
        conversationId,
      );

      expect(participantHistory.unassignedAt).toBeDefined();
      expect(conversation.participant).toBeNull();
      expect(conversationHistoryRepository.save).toHaveBeenCalledWith(
        participantHistory,
      );
      expect(conversationRepository.save).toHaveBeenCalledWith(conversation);
    });

    it('should remove a participant from a conversation as an organization member', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      const listing = new Listing();
      Object.assign(listing, {
        organizationId: 1,
      });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId,
        type: ConversationType.INQUIRY,
        listing,
      });

      const executor = new User();
      Object.assign(executor, {
        id: executorId,
        organizationId: 1,
      });

      const participantHistory = new ConversationHistory();
      Object.assign(participantHistory, {
        conversationId,
        participantId,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(executorId)
        .mockResolvedValue(executor);

      when(conversationHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, participantId },
          order: { assignedAt: 'DESC' },
        })
        .mockResolvedValue(participantHistory);

      when(conversationHistoryRepository.save)
        .calledWith(participantHistory)
        .mockResolvedValue(participantHistory);

      when(conversationRepository.save)
        .calledWith(conversation)
        .mockResolvedValue(conversation);

      await service.removeParticipantFromListingConversation(
        executorId,
        participantId,
        conversationId,
      );

      expect(participantHistory.unassignedAt).toBeDefined();
      expect(conversation.participant).toBeNull();
      expect(conversationHistoryRepository.save).toHaveBeenCalledWith(
        participantHistory,
      );
      expect(conversationRepository.save).toHaveBeenCalledWith(conversation);
    });

    it('should throw NotFoundException if conversation not found', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(null);

      await expect(
        service.removeParticipantFromListingConversation(
          executorId,
          participantId,
          conversationId,
        ),
      ).rejects.toThrow(new NotFoundException('Conversation not found'));
    });

    it('should throw BadRequestException if conversation is not an inquiry', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        type: ConversationType.DIRECT,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.removeParticipantFromListingConversation(
          executorId,
          participantId,
          conversationId,
        ),
      ).rejects.toThrow(
        new BadRequestException('Conversation is not an inquiry'),
      );
    });

    it('should throw BadRequestException if specified user is not the participant', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId: 4,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      await expect(
        service.removeParticipantFromListingConversation(
          executorId,
          participantId,
          conversationId,
        ),
      ).rejects.toThrow(
        new BadRequestException(
          'Specified user is not the participant of the conversation',
        ),
      );
    });

    it('should throw NotFoundException if executor not found', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId,
        type: ConversationType.INQUIRY,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById).calledWith(executorId).mockResolvedValue(null);

      await expect(
        service.removeParticipantFromListingConversation(
          executorId,
          participantId,
          conversationId,
        ),
      ).rejects.toThrow(new NotFoundException('Executor not found'));
    });

    it('should throw BadRequestException if executor is not authorized', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      const listing = new Listing();
      Object.assign(listing, {
        organizationId: 4,
      });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId,
        type: ConversationType.INQUIRY,
        listing,
      });

      const executor = new User();
      Object.assign(executor, {
        id: executorId,
        organizationId: 5,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(executorId)
        .mockResolvedValue(executor);

      await expect(
        service.removeParticipantFromListingConversation(
          executorId,
          participantId,
          conversationId,
        ),
      ).rejects.toThrow(
        new BadRequestException(
          'Executor is not part of the organization that owns the listing',
        ),
      );
    });

    it('should throw NotFoundException if participant history not found', async () => {
      const executorId = 1;
      const participantId = 2;
      const conversationId = 3;

      const listing = new Listing();
      Object.assign(listing, {
        organizationId: 1,
      });

      const conversation = new Conversation();
      Object.assign(conversation, {
        id: conversationId,
        participantId,
        type: ConversationType.INQUIRY,
        listing,
      });

      const executor = new User();
      Object.assign(executor, {
        id: executorId,
        organizationId: 1,
      });

      when(conversationRepository.findOne)
        .calledWith({
          where: { id: conversationId },
          relations: { listing: true },
        })
        .mockResolvedValue(conversation);

      when(userService.findById)
        .calledWith(executorId)
        .mockResolvedValue(executor);

      when(conversationHistoryRepository.findOne)
        .calledWith({
          where: { conversationId, participantId },
          order: { assignedAt: 'DESC' },
        })
        .mockResolvedValue(null);

      await expect(
        service.removeParticipantFromListingConversation(
          executorId,
          participantId,
          conversationId,
        ),
      ).rejects.toThrow(
        new NotFoundException('Participant history record not found'),
      );
    });
  });
});
