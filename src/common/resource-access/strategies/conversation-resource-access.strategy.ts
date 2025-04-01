import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../../../user/entities/user.entity';
import { ConversationsService } from '../../../conversations/conversations.service';
import { ConversationType } from '../../../conversations/entities/conversation.entity';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';

/**
 * Strategy for conversation resource access
 *
 * For direct conversations,
 * the user is part of the conversation if they are the participant or the initiator
 *
 * For inquiry conversations,
 * the user is part of the conversation if they are part of the organization that owns the listing or the initiator or the handler
 */
@Injectable()
export class ConversationResourceAccessStrategy extends ResourceAccessStrategy {
  private conversationIdParam: string = 'conversationId';

  constructor(private readonly conversationsService: ConversationsService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    // If the conversation id is not provided, the user can't access it
    const conversationId = parseInt(params[this.conversationIdParam]);
    if (isNaN(conversationId)) {
      return false;
    }

    // If the user is a guest, they can't access the conversation
    if (user.type === UserRole.GUEST) {
      return false;
    }

    // If the conversation doesn't exist, the user can't access it
    const conversation = await this.conversationsService.findById(
      conversationId,
      {
        relations: { listing: true },
      },
    );
    if (!conversation) {
      return false;
    }

    // If the conversation is a direct conversation,
    // the user can access it if they are the participant or the initiator
    if (conversation.type === ConversationType.DIRECT) {
      return (
        conversation.participantId === user.id ||
        conversation.initiatorId === user.id
      );
    }

    // If the conversation is an inquiry conversation, the user can access it if they are part of the organization that owns the listing or the initiator
    if (conversation.type === ConversationType.INQUIRY) {
      // This should never happen, but we'll check anyway
      if (!user.organizationId || !conversation.listing) {
        return false;
      }

      // If the user is part of the organization that owns the listing, they can access the conversation
      if (user.organizationId === conversation.listing.ownerId) {
        return true;
      }

      // If the user is the initiator or the participant, they can access the conversation
      return (
        conversation.initiatorId === user.id ||
        conversation.participantId === user.id
      );
    }

    return false;
  }
}
