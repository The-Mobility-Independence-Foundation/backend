import { Injectable } from '@nestjs/common';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';

/**
 * Strategy to check if the user can access their own profile
 * Should always return true
 */
@Injectable()
export class UserMeResourceAccessStrategy extends ResourceAccessStrategy {
  async canAccess(): Promise<boolean> {
    return true;
  }
}
