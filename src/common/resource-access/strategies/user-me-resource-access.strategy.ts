import { Injectable } from '@nestjs/common';
import { ResourceAccessStrategy } from './generic/resource-access.strategy';

@Injectable()
export class UserMeResourceAccessStrategy extends ResourceAccessStrategy {
  async canAccess(): Promise<boolean> {
    return true;
  }
}
