import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { PaginationService } from '../common/services/pagination.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { ListingsService } from '../listings/listings.service';
import { ConversationHistory } from './entities/conversation-history.entity';
import { ListingStatus } from '../listings/listing.entity';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationHistory)
    private readonly conversationHistoryRepository: Repository<ConversationHistory>,
    private readonly userService: UserService,
    private readonly listingsService: ListingsService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Find a conversation by id
   * @param id - The id of the conversation
   * @param options - Optional query options
   * @returns The conversation record
   */
  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Conversation, 'id'>>;
      relations: FindOptionsRelations<Conversation>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    return this.conversationRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
    });
  }

  /**
   * Find a conversation by id or throw an error
   * @param id - The id of the conversation
   * @param options - Optional query options
   * @returns The conversation record
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Conversation, 'id'>>;
      relations: FindOptionsRelations<Conversation>;
    }> = {},
  ) {
    const conversation = await this.findById(id, options);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  /**
   * Find all conversations for a user through pagination
   * @param userId - The id of the user
   * @param paginationDto - The pagination dto
   * @returns The paginated conversations
   */
  async findAll(userId: number, paginationDto: CursorPaginationDto) {
    return this.paginationService.paginateWithCursor(
      this.conversationRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: [{ initiatorId: userId }, { participantId: userId }],
      },
    );
  }

  /**
   * Get the latest participant history record for a conversation
   * @param conversationId - The id of the conversation
   * @param participantId - The id of the participant
   * @returns The latest participant history record
   */
  async getLatestParticipantHistory(
    conversationId: number,
    participantId?: number,
  ) {
    return this.conversationHistoryRepository.findOne({
      where: { conversationId, participantId },
      order: {
        assignedAt: 'DESC',
      },
    });
  }

  /**
   * Initiate a direct conversation with a user
   * @param initiatorId - The id of the initiator
   * @param participantId - The id of the participant
   * @returns The created conversation
   */
  async initiateDirectConversation(
    initiatorId: number,
    participantId: number,
  ): Promise<Conversation> {
    if (initiatorId === participantId) {
      throw new BadRequestException(
        'Initiator and participant cannot be the same',
      );
    }

    const existingConversation = await this.conversationRepository.findOne({
      where: [
        {
          initiatorId,
          participantId,
        },
        {
          initiatorId: participantId,
          participantId: initiatorId,
        },
      ],
    });
    if (existingConversation) {
      throw new BadRequestException('Conversation already exists');
    }

    const initiator = await this.userService.findById(initiatorId);
    if (!initiator) {
      throw new NotFoundException('Initiator not found');
    }

    const participant = await this.userService.findById(participantId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    if (participant.type === UserRole.GUEST) {
      throw new BadRequestException('Cannot initiate conversation with guest');
    }

    const conversation = this.conversationRepository.create({
      initiatorId,
      participantId,
      type: ConversationType.DIRECT,
    });

    await this.conversationRepository.insert(conversation);

    return conversation;
  }

  /**
   * Initiate a listing conversation with an organization
   * This will power the conversation pooling system
   * @param initiatorId - The id of the initiator
   * @param listingId - The id of the listing
   * @returns The created conversation
   */
  async initiateListingConversation(
    initiatorId: number,
    listingId: number,
  ): Promise<Conversation> {
    const existingConversation = await this.conversationRepository.findOne({
      where: {
        initiatorId,
        listingId,
      },
    });
    if (existingConversation) {
      throw new BadRequestException('Conversation already exists');
    }

    const listing = await this.listingsService.findByIdOrThrow(listingId);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException('Listing is not active');
    }

    const initiator = await this.userService.findById(initiatorId);
    if (!initiator) {
      throw new NotFoundException('Initiator not found');
    }

    if (listing.organizationId === initiator.organizationId) {
      throw new BadRequestException(
        'Initiator cannot initiate a conversation with their own organization',
      );
    }

    const conversation = this.conversationRepository.create({
      initiatorId,
      listingId,
      type: ConversationType.INQUIRY,
    });

    await this.conversationRepository.insert(conversation);

    return conversation;
  }

  /**
   * Enter a listing conversation as a participant
   * Must be part of the organization that owns the listing
   * @param participantId - The id of the participant
   * @param conversationId - The id of the conversation
   * @returns The updated conversation
   */
  async enterListingConversation(
    participantId: number,
    conversationId: number,
  ): Promise<Conversation> {
    const conversation = await this.findById(conversationId, {
      relations: {
        listing: true,
      },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type !== ConversationType.INQUIRY) {
      throw new BadRequestException('Conversation is not an inquiry');
    }

    const participant = await this.userService.findById(participantId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    if (conversation.participantId === participantId) {
      throw new BadRequestException(
        'User is already a participant of the conversation',
      );
    }

    if (conversation.participantId) {
      throw new BadRequestException('Conversation already has a participant');
    }

    if (conversation.listing?.organizationId !== participant.organizationId) {
      throw new BadRequestException(
        'Participant is not part of the organization that owns the listing',
      );
    }

    const participantHistory = this.conversationHistoryRepository.create({
      conversation,
      participant,
    });
    await this.conversationHistoryRepository.insert(participantHistory);

    conversation.participant = participant;
    return await this.conversationRepository.save(conversation);
  }

  /**
   * Leave a listing conversation as a participant
   * Must be part of the organization that owns the listing
   * @param participantId - The id of the participant
   * @param conversationId - The id of the conversation
   * @returns The updated conversation
   */
  async leaveListingConversation(
    participantId: number,
    conversationId: number,
  ): Promise<Conversation> {
    const conversation = await this.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type !== ConversationType.INQUIRY) {
      throw new BadRequestException('Conversation is not an inquiry');
    }

    if (conversation.participantId !== participantId) {
      throw new BadRequestException(
        'User is not the participant of the conversation',
      );
    }

    const participantHistory = await this.getLatestParticipantHistory(
      conversationId,
      participantId,
    );
    if (!participantHistory) {
      throw new NotFoundException('Participant history record not found');
    }

    participantHistory.unassignedAt = new Date();
    await this.conversationHistoryRepository.save(participantHistory);

    conversation.participant = null;
    return await this.conversationRepository.save(conversation);
  }

  /**
   * Remove a participant from a listing conversation
   * Must be admin or part of the organization that owns the listing
   * @param executorId - The id of the executor
   * @param participantId - The id of the participant
   * @param conversationId - The id of the conversation
   * @returns The updated conversation
   */
  async removeParticipantFromListingConversation(
    executorId: number,
    participantId: number,
    conversationId: number,
  ): Promise<Conversation> {
    const conversation = await this.findById(conversationId, {
      relations: {
        listing: true,
      },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type !== ConversationType.INQUIRY) {
      throw new BadRequestException('Conversation is not an inquiry');
    }

    if (conversation.participantId !== participantId) {
      throw new BadRequestException(
        'Specified user is not the participant of the conversation',
      );
    }

    const executor = await this.userService.findById(executorId);
    if (!executor) {
      throw new NotFoundException('Executor not found');
    }

    if (executor.type !== UserRole.ADMIN) {
      if (executor.organizationId !== conversation.listing?.organizationId) {
        throw new BadRequestException(
          'Executor is not part of the organization that owns the listing',
        );
      }
    }

    const participantHistory = await this.getLatestParticipantHistory(
      conversationId,
      participantId,
    );
    if (!participantHistory) {
      throw new NotFoundException('Participant history record not found');
    }

    participantHistory.unassignedAt = new Date();
    await this.conversationHistoryRepository.save(participantHistory);

    conversation.participant = null;
    return await this.conversationRepository.save(conversation);
  }
}
