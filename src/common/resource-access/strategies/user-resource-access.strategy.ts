import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';

/**
 * Strategy for user resource access
 * Allows only authenticated users to access their own data
 */
@Injectable()
export class UserResourceAccessStrategy extends ResourceAccessStrategy {
  private userIdParam: string = 'userId';

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    if (user.type === UserRole.GUEST) {
      return false;
    }

    const resourceUserId = parseInt(params[this.userIdParam]);
    return !isNaN(resourceUserId) && user.id === resourceUserId;
  }

  getForbiddenMessage(): string {
    return "You do not have permission to access this user's data";
  }
}
