import { Injectable } from '@nestjs/common';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';

/**
 * Strategy for any resource access
 * Allows any authenticated user to access the resource
 */
@Injectable()
export class AnyUserResourceAccessStrategy extends ResourceAccessStrategy {
  async canAccess(): Promise<boolean> {
    return true;
  }

  getForbiddenMessage(): string {
    return 'You must be authenticated to access this resource';
  }
}
