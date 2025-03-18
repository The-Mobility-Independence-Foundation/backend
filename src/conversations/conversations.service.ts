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
import { ListingService } from '../listing/listing.service';
import { ConversationHandlerHistory } from './entities/conversation-handler-history.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationHandlerHistory)
    private readonly handlerHistoryRepository: Repository<ConversationHandlerHistory>,
    private readonly userService: UserService,
    private readonly listingService: ListingService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Find a listing by id
   * @param id - The id of the listing
   * @param options - Optional query options
   * @returns The listing record
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
        // where: [{ initiatorId: userId }, { participantId: userId }],
      },
    );
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
        'Initiator and recipient cannot be the same',
      );
    }

    if (await this.doesConversationExist({ initiatorId, participantId })) {
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
   * @param initiatorId - The id of the initiator
   * @param listingId - The id of the listing
   * @returns The created conversation
   */
  async initiateListingConversation(
    initiatorId: number,
    listingId: number,
  ): Promise<Conversation> {
    if (await this.doesConversationExist({ initiatorId, listingId })) {
      throw new BadRequestException('Conversation already exists');
    }

    const initiator = await this.userService.findById(initiatorId);
    if (!initiator) {
      throw new NotFoundException('Initiator not found');
    }

    const listing = await this.listingService.findById(listingId);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // TODO: Check if the listing is a valid state

    const conversation = this.conversationRepository.create({
      initiatorId,
      listingId,
      type: ConversationType.INQUIRY,
    });

    await this.conversationRepository.insert(conversation);

    return conversation;
  }

  /**
   * Check if a conversation exists
   * @param where - The where clause
   * @returns True if the conversation exists, false otherwise
   */
  async doesConversationExist(
    where:
      | { initiatorId: number; listingId: number }
      | { initiatorId: number; participantId: number },
  ): Promise<boolean> {
    if ('listingId' in where) {
      const conversation = await this.conversationRepository.findOne({
        where: {
          initiatorId: where.initiatorId,
          listingId: where.listingId,
        },
      });

      return Boolean(conversation);
    }

    const conversation = await this.conversationRepository.findOne({
      where: [
        {
          initiatorId: where.initiatorId,
          participantId: where.participantId,
        },
        {
          initiatorId: where.participantId,
          participantId: where.initiatorId,
        },
      ],
    });

    return Boolean(conversation);
  }

  /**
   * Enter a conversation as a handler (for conversations that are 'inquiries' on listings)
   * @param handlerId - The id of the handler
   * @param conversationId - The id of the conversation
   */
  async enterConversation(handlerId: number, conversationId: number) {
    const conversation = await this.findById(conversationId, {
      relations: {
        initiator: true,
        participant: true,
        listing: true,
      },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type !== ConversationType.INQUIRY) {
      throw new BadRequestException('Conversation is not an inquiry');
    }

    const handler = await this.userService.findById(handlerId);
    if (!handler) {
      throw new NotFoundException('Handler not found');
    }

    if (conversation.handlerId) {
      throw new BadRequestException('Conversation already has a handler');
    }

    if (conversation.listing?.owner.id !== handler.organization?.id) {
      throw new BadRequestException(
        'Handler is not part of the organization that owns the listing',
      );
    }

    const handlerHistory = this.handlerHistoryRepository.create({
      conversation,
      handler,
    });
    await this.handlerHistoryRepository.insert(handlerHistory);

    conversation.handler = handler;
    return await this.conversationRepository.save(conversation);
  }

  /**
   * Leave a conversation as a handler (for conversations that are 'inquiries' on listings)
   * @param handlerId - The id of the handler
   * @param conversationId - The id of the conversation
   */
  async leaveConversation(handlerId: number, conversationId: number) {
    const conversation = await this.findById(conversationId, {
      relations: {
        initiator: true,
        participant: true,
      },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.type !== ConversationType.INQUIRY) {
      throw new BadRequestException('Conversation is not an inquiry');
    }

    // Check if the user is the handler of the conversation
    if (conversation.handlerId !== handlerId) {
      throw new BadRequestException(
        'User is not the handler of the conversation',
      );
    }

    // Get the handler history record
    const handlerHistory = await this.handlerHistoryRepository.findOne({
      where: { conversationId: conversation.id, handlerId },
    });
    if (!handlerHistory) {
      throw new NotFoundException('Handler history record not found');
    }

    // Update the handler history record to unassigned
    handlerHistory.unassignedAt = new Date();
    await this.handlerHistoryRepository.save(handlerHistory);

    // Update the conversation with the new handler
    conversation.handler = null;
    await this.conversationRepository.save(conversation);
  }
}
