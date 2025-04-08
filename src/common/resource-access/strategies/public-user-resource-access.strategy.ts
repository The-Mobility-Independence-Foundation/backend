import { Injectable } from '@nestjs/common';
import { User, UserRole } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';

/**
 * Strategy for public user resource access
 * Allows only non-guest users to access public data
 */
@Injectable()
export class PublicUserResourceAccessStrategy extends ResourceAccessStrategy {
  async canAccess(user: User): Promise<boolean> {
    return user.type !== UserRole.GUEST;
  }

  getForbiddenMessage(): string {
    return 'You must be a non-guest user to access this resource';
  }
}
