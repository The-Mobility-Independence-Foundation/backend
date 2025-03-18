import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';
import { ConversationService } from '../../../conversation/conversation.service';

/**
 * Strategy for conversation resource access
 * Checks if the user is a participant in the conversation
 */
@Injectable()
export class ConversationResourceAccessStrategy extends ResourceAccessStrategy {
  private conversationIdParam: string = 'conversationId';

  constructor(private readonly conversationService: ConversationService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const conversationId = parseInt(params[this.conversationIdParam]);
    if (isNaN(conversationId)) {
      return false;
    }

    const conversation = await this.conversationService.findOne(conversationId);

    if (!conversation) {
      return false;
    }

    return (
      conversation.participant1.id === user.id ||
      conversation.participant2.id === user.id
    );
  }
}
