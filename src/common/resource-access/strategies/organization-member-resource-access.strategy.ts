import { Injectable } from '@nestjs/common';
import { User } from '../../../user/entities/user.entity';
import { ResourceAccessStrategy } from './resource-access.strategy';
import { UserService } from '../../../user/user.service';

/**
 * Strategy for organization resource access
 * Checks if the user is the owner of the organization
 */
@Injectable()
export class OrganizationMemberResourceAccessStrategy extends ResourceAccessStrategy {
  private organizationIdParam: string = 'orgId';
  private userIdParam: string = 'userId';

  constructor(private readonly userService: UserService) {
    super();
  }

  async canAccess(user: User, params: Record<string, any>): Promise<boolean> {
    const orgId = parseInt(params[this.organizationIdParam]);
    const userId = parseInt(params[this.userIdParam]);

    if (isNaN(orgId) || isNaN(userId)) {
      return false;
    }

    const member = await this.userService.findByIdOrThrow(userId, {
      relations: {
        organization: true,
      },
    });

    if (!member) {
      return false;
    }

    return orgId === member.organization?.id;
  }
}
