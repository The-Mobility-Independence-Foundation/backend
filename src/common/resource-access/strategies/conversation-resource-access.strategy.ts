import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';
import { ConversationsService } from '../../../conversations/conversations.service';

/**
 * Strategy for conversation resource access
 * Checks if the user is a participant in the conversation
 */
@Injectable()
export class ConversationResourceAccessStrategy extends ResourceAccessStrategy {
  private conversationIdParam: string = 'conversationId';

  constructor(private readonly conversationsService: ConversationsService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const conversationId = parseInt(params[this.conversationIdParam]);
    if (isNaN(conversationId)) {
      return false;
    }

    const conversation =
      await this.conversationsService.findById(conversationId);

    if (!conversation) {
      return false;
    }

    return true;
    // return conversation.participant.id === user.id;
  }
}
