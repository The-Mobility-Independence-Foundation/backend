import { User } from '../../../../user/entities/user.entity';

/**
 * Base class for resource access strategies
 */
export abstract class ResourceAccessStrategy {
  abstract canAccess(user: User, params: Record<string, any>): Promise<boolean>;

  getForbiddenMessage(): string {
    return 'You do not have permission to access this resource';
  }
}
