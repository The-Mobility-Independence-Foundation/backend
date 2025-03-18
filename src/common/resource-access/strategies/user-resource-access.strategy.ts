import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';

/**
 * Strategy for user resource access
 * Checks if the user has access to the resource by comparing user IDs
 */
@Injectable()
export class UserResourceAccessStrategy extends ResourceAccessStrategy {
  private userIdParam: string = 'userId';

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const resourceUserId = parseInt(params[this.userIdParam]);
    return !isNaN(resourceUserId) && user.id === resourceUserId;
  }
}
