import { Injectable } from '@nestjs/common';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';
import { User, UserRole } from '../../../user/entities/user.entity';

/**
 * Strategy for guest resource access
 * Allows only guest users to access the resource
 */
@Injectable()
export class GuestResourceAccessStrategy extends ResourceAccessStrategy {
  async canAccess(user: User): Promise<boolean> {
    return user.type === UserRole.GUEST;
  }

  getForbiddenMessage(): string {
    return 'You must be a guest to access this resource';
  }
}
