import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';
import { ConversationsService } from '../../../conversations/conversations.service';
import { ConversationType } from '../../../conversations/entities/conversation.entity';

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

    // If the conversation is an inquiry conversation,
    // the user can access it if they are part of the organization that owns the listing or the initiator
    if (conversation.type === ConversationType.INQUIRY) {
      // We can/will perform more narrow checks in the service layer
      // for when the user is part of the organization that owns the listing
      if (user.organizationId === conversation.listing?.ownerId) {
        return true;
      }

      return conversation.initiatorId === user.id;
    }

    return false;
  }
}
